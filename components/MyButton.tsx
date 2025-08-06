import { Button, ButtonText } from '@/components/ui/button';
import { PropsWithChildren } from 'react';
import { GestureResponderEvent } from 'react-native';

type MyButtonProps = PropsWithChildren<{
  onPress: (event: GestureResponderEvent) => void;
}>;

export function MyButton({ children, onPress }: MyButtonProps) {
  return (
    <Button onPress={onPress}>
      <ButtonText>
        {children}
      </ButtonText>
    </Button>
  );
}
