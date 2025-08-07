

import { KeyboardAvoidingView, StyleSheet } from 'react-native';


import { ThemedText } from '@/components/ThemedText';


import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@/components/ui/modal";

import { HomeButton } from '@/components/HomeButton';
import MyScrollView from '@/components/MyScrollView';
import SelectItemGlu from '@/components/selectitemglu';
import { Button, ButtonGroup, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { AddIcon, BellIcon, CalendarDaysIcon, CheckCircleIcon, ChevronRightIcon, MoonIcon, SearchIcon, StarIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { addTasks, createTaskList } from '@/lib/mutations';
import { useAuthStore } from '@/store/authCtx';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
export default function HomeScreen() {
  const [addList, setaddList] = React.useState(false)
  const [addReminder, setaddReminder] = React.useState(false)
   const { taskLists,addTaskList,userId,setTaskLists } = useAuthStore();
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [showDatePicker, setShowDatePicker] = useState(false);
const [showTimePicker, setShowTimePicker] = useState(false);
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [selectedTime, setSelectedTime] = useState<Date | null>(null);
   type AddListData = {
    listName: string;
  };
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddListData>({
    defaultValues: {
      listName: "",
    },
  });
  
  const createList = useMutation({
    mutationFn: createTaskList,
    onSuccess: async (data) => {
      console.log("List created successfully:", data);
      addTaskList({ name: data[0].title, id: data[0].id, tasks: [] }); // Assuming this updates local state
    },
    onError: (error: any) => {
      console.log("Failed to create list", error.message);
      setErrorMessage("Failed to create list"); // Make sure setErrorMessage exists
    },
  });
  
  const onSubmit = (data: AddListData) => {
    if (userId) {
      createList.mutate({
        userId, // ensure userId is defined in your component
        listName: data.listName,
      });
      console.log("List created successfully:", data.listName,userId);
    } else {
      console.error("userId is null. Cannot create a list.");
    }
  };
  type TaskData ={
    taskName: string;
    date:  string; 
    time: string;
    description: string;
    listName: string;
  };
  const {
    control: taskControl,
    setValue,
    reset:resetTaskFrom,
    
    handleSubmit: handleTaskSubmit,
    formState: { errors: taskErrors },
  } = useForm<TaskData>({
    defaultValues: {
      taskName: "",
      date: "",
      time: "",
      description: "",
      listName: "",
    },
  });
  const addTask = useMutation({
    mutationFn: addTasks,
    onSuccess: async (data) => {
      console.log("Task added successfully:", data);
      const newTask = {
        id: data[0].id,
        name: data[0].title,
        dateTime: data[0].due_date,
        completed: data[0].status != 'pending', // Assuming 'completed' is a valid status
        favorite: data[0].favorite,
      };
      
      const listId = data[0].todo_list_id;
      const updatedLists = taskLists.map((list) =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, newTask] }
          : list
      );
      
      setTaskLists(
       updatedLists // Update the taskLists state with the new task
      
      );
      
      
    },
    onError: (error: any) => {
      console.log("Failed to add task", error.message);
      setErrorMessage("Failed to add task"); // Make sure setErrorMessage exists
    },

  });
  const onTaskSubmit = (data: TaskData) => {
    if (userId) {
      const listId= taskLists.find(list => list.name === data.listName)?.id || "";
      const taskDueDate = new Date(`${data.date}T${data.time}`); // Assuming date is in 'dd-mm-yyyy' format and time in 'hh:mm' format
if(listId && taskDueDate)
{
  
  addTask.mutate({
    userId, // ensure userId is defined in your component
    listId, // ensure listId is defined in your component
    taskTitle: data.taskName,
    taskDescription: data.description,
    taskDueDate, // Ensure this is a Date object
  });
}
      

      console.log("Task went to database:");

    } else {
      console.error("userId is null. Cannot add a task.");
    }
    
    resetTaskFrom(); 
  };

  
  return (
    
    <MyScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      >
        

          
        <Input variant='outline' size='lg' >
        <InputField placeholder='Search'/>
        <InputSlot>
        
        <InputIcon as={SearchIcon} />
        </InputSlot>

        </Input>
      
      <Center>
      <HStack space='2xl' >
      <HomeButton icon={CalendarDaysIcon} label="Today        " count={0} onPress={() => router.push({ pathname: "/(app)/list", params: { title: "Today" } })} />
      <HomeButton icon={BellIcon} label="Scheduled" count={0} onPress={() => router.push({ pathname: "/(app)/list", params: { title: "Scheduled" } })} />
      </HStack>
      </Center>
      <Center>
      <HStack space='2xl'>
      <HomeButton icon={CheckCircleIcon} label="All             " count={0} onPress={() => router.push({ pathname: "/(app)/list", params: { title: "All" } })} />
      <HomeButton icon={StarIcon} label="Favorites" count={0} onPress={() => router.push({ pathname: "/(app)/list", params: { title: "Favorites" } })} />
      </HStack>
      </Center>
      <Center>
      <HStack space='2xl'>
      <HomeButton icon={CalendarDaysIcon} label="Completed" count={0} onPress={() => router.push({ pathname: "/(app)/list", params: { title: "Completed" } })} />
      <Center>
      <HomeButton icon={AddIcon} label="Add List"  onPress={() => {
        setaddList(true)
        console.log(taskLists)
      }} />
      <Modal
        isOpen={addList}
        onClose={() => {
          setaddList(false)
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Add a New List
            </Heading>
            
          </ModalHeader>
          <ModalBody>
          <Controller 
  control={control}
  rules={{ required: true }}
  name="listName" // ❗ FIXED (was: name:'listName')
  render={({ field: { onChange, onBlur, value } }) => (
    <Input
      variant="outline"
      size="md"
      isDisabled={false}
      isInvalid={!!errors.listName}
      isReadOnly={false}
      
    >
      <InputField placeholder="Enter List Name" onBlur={onBlur}
      onChangeText={onChange}
      value={value} />
    </Input>
  )}
/>
{errors.listName && <ThemedText>This is required.</ThemedText>}
            
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setaddList(false)
                // Call handleSubmit to trigger form validation and submission
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                
                handleSubmit(onSubmit)(); 
                setaddList(false)
                console.log('hi')
              }}
            >
              <ButtonText>Add</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Center>
      
      </HStack>
      </Center>
      <HStack space='2xl'>
      </HStack>
      
      <Button size="lg" onPress={() => {setaddReminder(true)}} >
          <HStack space="sm" style={{justifyContent:'center',alignItems:'center'}}>
            <ButtonIcon as={AddIcon} />
            <ButtonText>New Reminder</ButtonText>
          </HStack>
        </Button>
        <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
        <Modal
        isOpen={addReminder}
        onClose={() => {
          setaddReminder(false)
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Add a New Reminder
            </Heading>
            
          </ModalHeader>
          <ModalBody>
            <Center>
            <Controller control={taskControl} rules={{ required: true }} name="taskName" render={({ field: { onChange, onBlur, value } }) => (
              <Input
                variant="outline"
                size="md"
                isDisabled={false}
                isInvalid={!!taskErrors.taskName}
                isReadOnly={false}
              >
                <InputField placeholder="Enter Task Name" onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}/>
            {taskErrors.taskName && <ThemedText>This is required.</ThemedText>}
            </Center>
  
  <Center>
    <HStack style={{justifyContent:'space-around'}} space='4xl' >
    <Button onPress={() => setShowDatePicker(true)} style={{flex:1}}>
    <ButtonText>
      {selectedDate ? selectedDate.toDateString() : 'Pick a Date'}
    </ButtonText>
  </Button>

  <Button onPress={() => setShowDatePicker(false)} action='positive'>
    <ButtonText>
      {'Done'}
    </ButtonText>
  </Button>

    </HStack>
  

  {showDatePicker && (
    <DateTimePicker
      mode="date"
      value={selectedDate || new Date()}
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={(event, date) => {
        
        if (date) {
          setSelectedDate(date);
          setValue('date', date.toISOString().split('T')[0]);
        }
      }}
    />
  )}
  {taskErrors.date && <ThemedText>This is required.</ThemedText>}
</Center>
<Center>
  <HStack style={{justifyContent:'space-around'}} space='4xl'>
  <Button onPress={() => setShowTimePicker(true)} style={{flex:1}}>
    <ButtonText>
      {selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pick a Time'}
    </ButtonText>
  </Button>
  <Button onPress={() => setShowTimePicker(false)} action='positive'>
    <ButtonText>
      {'Done'}
    </ButtonText>
  </Button>
  </HStack>
  

  {showTimePicker && (
    <DateTimePicker
      mode="time"
      value={selectedTime || new Date()}
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={(event, time) => {
        
        if (time) {
          setSelectedTime(time);
          setValue('time', time.toTimeString().split(' ')[0].slice(0,5)); // hh:mm
        }
      }}
    />
  )}
  {taskErrors.time && <ThemedText>This is required.</ThemedText>}
</Center>
            
  

            
                 
                



                <Controller
              control={taskControl}
              rules={{ required: true }}
              name='description'
              render={({ field: { onChange, onBlur, value } }) => (
               
                <Textarea size="md" isReadOnly={false} isInvalid={!!taskErrors.description} isDisabled={false}>
               <TextareaInput placeholder="Task Description ..."  onBlur={onBlur} onChangeText={onChange} value={value}/>
               </Textarea>
              )}
            />
            {taskErrors.description && <ThemedText>This is required.</ThemedText>}

            <Controller
              control={taskControl}
              rules={{ required: true }}
              name='listName'
              render={({ field: { onChange, onBlur, value } }) => (
                <SelectItemGlu 
                isValid={!!taskErrors.listName} onBlur={onBlur} onChange={onChange} value={value} />
                
              )}
            />
            {taskErrors.listName && <ThemedText>This is required.</ThemedText>}
               
               
               
              
             
             
            
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setaddReminder(false)
                setSelectedDate(null);
                setSelectedTime(null);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleTaskSubmit((data) => {
                onTaskSubmit(data);     
                 
                setSelectedDate(null);
                setSelectedTime(null);
                setaddReminder(false); 

              })}

              
            >
              <ButtonText>Add</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
        </Modal>
        </KeyboardAvoidingView>
        
      
     
      
      <ThemedText type="title" >
        My Lists
      </ThemedText>
      <ButtonGroup space='sm' >
    
      {
        taskLists.map(task =>{
          return (
            <Button action='secondary' style={{justifyContent:'space-between'}} key={task.id}
            onPress={() => {
              
              router.push({
                pathname: '/reminder',
                params: {
                  title: `${task.name}`,
                  reminders: JSON.stringify(task.tasks),
                },
              });
            }}
            >
            <HStack  space='lg' style={{justifyContent:'space-between'}}>
            <ButtonIcon as={MoonIcon} size='lg'/>
            <ButtonText>{task.name}</ButtonText>
            </HStack>
            <HStack space='sm' style={{alignItems:'center'}}>
            <ButtonText size='md'>{task.tasks.length}</ButtonText>
            <ButtonIcon as={ChevronRightIcon} size='md'/>
            </HStack>
            
            </Button>
          )
        })
       }
      </ButtonGroup>
      
       
     
      
      
     
     
      
      
    </MyScrollView>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
