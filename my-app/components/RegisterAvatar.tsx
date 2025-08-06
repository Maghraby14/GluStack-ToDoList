import { Avatar,AvatarBadge,AvatarFallbackText, AvatarImage} from '@/components/ui/avatar';
import { Center } from '@/components/ui/center';
export function RegisterAvatar (){
    return(
<Center  >
      <Avatar size="xl" style={{ backgroundColor: 'transparent' }}>
  <AvatarImage
    source={require('@/assets/images/to-do-list.png')}
    style={{
      
      resizeMode:'contain', // or 'contain' depending on what you want
      borderRadius: 9999,  // ensures it's circular
    }}
  />
</Avatar>

      </Center>
    );
}
