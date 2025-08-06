import React from "react";
//import { Pressable, Text, HStack, VStack } from "@gluestack-ui/themed";
import { HStack } from "./ui/hstack";
import { Button,ButtonText,ButtonIcon } from "./ui/button";
import { VStack } from "./ui/vstack";
import { SvgProps } from "react-native-svg";
import { Text } from "./ui/text";
import { ThemedText } from "./ThemedText";
import { white } from "tailwindcss/colors";
import { useWindowDimensions } from "react-native";

type HomeButtonProps = {
  icon: React.ComponentType<SvgProps>; // e.g. InfoIcon
  label: string;
  count?: number;
  onPress?: () => void;
};

export const HomeButton = ({ icon: Icon, label, count, onPress }: HomeButtonProps) => {
    const { width } = useWindowDimensions();

    const buttonWidth = width / 2.7;
    return (
  
        
        <Button
            variant="solid"
            size="xl"
            
            onPress={onPress}
            style={{
              width: buttonWidth,
              height: 110,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
        >
            <HStack  space="2xl" style={{justifyContent:'space-between'}}>
                <VStack space="lg" >
                <ButtonIcon size="xl" as={Icon}/>
                <ButtonText size="xl">{label}</ButtonText>
                </VStack>
                <VStack>
             <ButtonText>
                {count}
             </ButtonText>
                </VStack>
            </HStack>
            
        
            
            
            </Button>
            
        
       
        
   
    
  );
};
