import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList } from 'react-native';

import MyViewContainer from '@/components/MyView';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText
} from '@/components/ui/actionsheet';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator
} from "@/components/ui/checkbox";
import { HStack } from '@/components/ui/hstack';
import { CheckIcon, EditIcon, StarIcon as FavorIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { supabase } from "@/lib/db";
import { useMutation } from '@tanstack/react-query';
import colors from 'tailwindcss/colors';
type Reminder = {
  id: string;
  title: string;
  description: string;
  due_date:string;
  favorite: boolean;
  status: string;
};

export default function ReminderScreen() {
  const { title, reminders } = useLocalSearchParams<{
    title: string;
    reminders: string;
  }>();

  const parsedReminders: Reminder[] = reminders ? JSON.parse(reminders) : [];

  const [reminderList, setReminderList] = useState(parsedReminders);
  const [sheetListId, setSheetListId] = useState<string | null>(null);
  const [isOpen, setOpen] = useState(false);

  const toggleDone = (id: string) =>
    setReminderList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status=='pending' ? 'done' : 'pending' } : r))
    );

  const toggleFavorite = (id: string) =>{
    setReminderList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))
    );
    console.log(reminderList[0]);
  }
  const handleLongPress = (id: string) => {
    setSheetListId(id);
    setOpen(true);
  };

  const handleEdit = () => {
    setOpen(false);
    console.log('Edit reminder', sheetListId);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("lists").delete().eq("id", id);
      return id;
    },
    onSuccess: (id: string) => {
      console.log("Reminder deleted:", id);
      setReminderList((prev) => prev.filter((r) => r.id !== id));
    },
  });

  const handleDelete = () => {
    setOpen(false);
    if (sheetListId) {
      deleteMutation.mutate(sheetListId);
    }
  };
  function splitDateTime(dateTime: string) {
    // Ensure ISO T format
    const iso = dateTime.includes('T') ? dateTime : dateTime.replace(' ', 'T');
    // Split date and time
    const [datePart, timePartAndMore] = iso.split('T');
    const timePart = timePartAndMore?.split('.')[0]; // strip ms/timezone if present
    return { date: datePart, time: timePart };
  }
  const renderItem = ({ item }: { item: Reminder }) => {
    const { date, time } = splitDateTime(item.due_date);
    return (
<Pressable onLongPress={() => handleLongPress(item.id)}>
      <HStack space="3xl" style={{ alignItems:"center",justifyContent:'flex-start' }}>
        <Checkbox isChecked={item.status =='done'} onChange={() => toggleDone(item.id)} value={item.status}>
        <CheckboxIndicator>
        <CheckboxIcon as={CheckIcon} />
      </CheckboxIndicator>
        </Checkbox>
        <VStack style={{flex:1 }}>
          <Text  size="lg" bold>
            {item.title}
          </Text>
          <Text size="sm" style={{color:colors.gray[500]}}>
            {item.description}
          </Text>
          <Text size="sm" style={{color:colors.gray[500]}}>
            {date} · {time}
          </Text>
        </VStack>
        <Pressable onPress={() => toggleFavorite(item.id)}>
          <Icon
            as={FavorIcon}
            size="xl"
            
            color={item.favorite ? colors.orange[500] : colors.gray[400]}
          />
        </Pressable>
      </HStack>
    </Pressable>
    );
  }
    
    
  

  return (
    <MyViewContainer
    headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
    
    
    <VStack  style={{flex:1}} space="md" >
      <Text size="2xl" bold>
        {title}
      </Text>

      <FlatList
        data={reminderList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      <Actionsheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetItem onPress={handleEdit}>
            <ActionsheetItemText>
              <Icon as={EditIcon} size="sm"  /> Edit
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleDelete}>
            <ActionsheetItemText  style={{color:colors.red[500]}} >
              <Icon as={TrashIcon} size="sm"   /> Delete
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={() => setOpen(false)}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
    </MyViewContainer>
  );
}
