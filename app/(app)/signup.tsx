import { StyleSheet } from 'react-native';
import { useForm, Controller } from "react-hook-form"
import MyScrollView from '@/components/MyScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Input, InputField } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { createTaskList, createUserRecord } from '@/lib/mutations';
import { MyAlert } from '@/components/MyAlert';
import {useState} from 'react';
import { RegisterAvatar } from '@/components/RegisterAvatar';
import { MyButton } from '@/components/MyButton';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/authCtx';
export default function SignupScreen() {
  const { setUserId,addTaskList,taskLists } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      const createUser = useMutation({
        mutationFn: createUserRecord,
        onSuccess: async (data) => {
         console.log('Success', 'User Created Succesfully');
          setUserId(data.id);
          try {
            const remindersList = await createTaskList({
              userId: data.id,
              listName: 'Reminders',
            });
      
            // Assuming remindersList is an array returned by Supabase .select()
            if (remindersList.length > 0) {
              addTaskList({ name: 'Reminders', id: remindersList[0].id,tasks: [] });
             
            }
          } catch (error) {
            console.error("Failed to create reminder list", error);
          }
         
          router.replace(('/home'));
        },
        onError: (error: any) => {
          console.log('Login Failed', error.message);
          setErrorMessage('Username already exists');
    setTimeout(() => setErrorMessage(null), 4000);
        },
      });
    
      const onSubmit = (data: FormData) => {
        const user =createUser.mutate(data);

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
        Create Account
      </MyButton>
      <Link href="/" style={{alignSelf: 'center'}}>
        <ThemedText type="defaultSemiBold">Already have an account? Log in</ThemedText>
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
