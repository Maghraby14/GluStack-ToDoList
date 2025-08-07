import { MyAlert } from '@/components/MyAlert';
import { MyButton } from '@/components/MyButton';
import MyScrollView from '@/components/MyScrollView';
import { RegisterAvatar } from '@/components/RegisterAvatar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Input, InputField } from '@/components/ui/input';
import { findUserRecord, getTaskLists, getTasks } from '@/lib/mutations';
import { useAuthStore } from '@/store/authCtx';
import { useMutation } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from 'react-native';
export default function LoginScreen() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUserId ,setTaskLists} = useAuthStore();
    type FormData ={
        
        password: string;
        username: string;
    }
    const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>({
        defaultValues: {
          username: "",
          password: "",
        },
      })
      const createUser =  useMutation({
        mutationFn: findUserRecord,
        onSuccess: async (data) => {
          console.log('Success', 'User found successfully');
          setUserId(data.id);
        
          try {
            const taskLists = await getTaskLists({ userId: data.id });
            console.log('Fetched Task Lists:', taskLists);
        
            // Fetch tasks for each list in parallel
            const enrichedLists = await Promise.all(
              taskLists.map(async (list: any) => {
                const tasks = await getTasks({ listId: list.id });
                return {
                  name: list.title,
                  id: list.id,
                  tasks: tasks ?? [],
                };
              })
            );
        
            setTaskLists(enrichedLists);
          } catch (error) {
            console.error('Failed to fetch user data', error);
          }
        
          router.replace('/home');
        },
        onError: (error: any) => {
          console.log('Login Failed', error.message);
          setErrorMessage('Username Not Found');
    setTimeout(() => setErrorMessage(null), 4000);
        },
      });
    
      const onSubmit = (data: FormData) => {
        createUser.mutate(data);
      };
    
    

  

  return (
    <MyScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      
    >
     
      

      <ThemedView style={styles.formContainer}>
      
      <RegisterAvatar />
      <Controller
        control={control}
        rules={{
          required:true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
      variant="outline"
      size="xl"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}

      >
<InputField placeholder='Username' onBlur={onBlur} onChangeText={onChange} value={value}/>      
      </Input>
        )}
        name="username"
      />
      
{errors.username && <ThemedText>This is required.</ThemedText>}
{errorMessage && (
  <MyAlert action='error'>
    {errorMessage}
  </MyAlert>
)}
<Controller
        control={control}
        rules={{
          required:true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          
          <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false} ><InputField 
placeholder='Password' 
onBlur={onBlur} 
onChangeText={onChange} 
value={value} 
secureTextEntry/>      
      </Input>
        )}
        name="password"
      />
      {errors.password && <ThemedText>This is required.</ThemedText>}

      <MyButton onPress={handleSubmit(onSubmit)}>
        Log in
      </MyButton>
      <Link href="/(app)/signup" style={{alignSelf: 'center'}}>
        <ThemedText type="defaultSemiBold">Don't have an account? Sign up</ThemedText>
      </Link>
      
      
      </ThemedView>
    </MyScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 100,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
