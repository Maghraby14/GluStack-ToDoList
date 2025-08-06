import { View, FlatList } from 'react-native';
import { Text } from '@/components/ui/text';
import {Box} from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { AddIcon } from '@/components/ui/icon'; 
import { Icon } from '@/components/ui/icon';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function ListScreen() {
    const { title } = useLocalSearchParams();
    
  // Dummy data
  const items = [
    { id: '1', name: 'Apples', icon: AddIcon, count: 3 },
    { id: '2', name: 'Bananas', icon: AddIcon, count: 5 },
    { id: '3', name: 'Cherries', icon: AddIcon, count: 7 },
  ];

  return (<>
  <Stack.Screen options={{ title: title?.toString() || "Default Title" }} />
   {
    <Box style={{flex:1}}>
      

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HStack
          style={{alignItems: 'center', justifyContent: 'space-between'
          }}
            
        
          >
            <HStack  space="md" style={{alignItems:'center'}}>
              <Icon as={item.icon} size="lg"  />
              <Text size="lg">{item.name}</Text>
            </HStack>
            <Text size="md" >
              {item.count}
            </Text>
          </HStack>
        )}
      />
    </Box>
   }
  </>
     
  );
}
