import { useState } from "react";
import { Box, Portal, VStack, Text, Stack, Input, HStack, Button, Select } from "@chakra-ui/react";
import CategoryBlock from "./CategoryBlock";

export const EditBox = ({ item, onClose, onSave, userCollection }) => {
  const [tempNum, setTempNum] = useState(item.num);
  const [tempManager, setTempManager] = useState(item.manager);
  
  const [category, setCategory] = useState({ category: item.category || "" });

  return (
    <Portal>
      {/* 1. 全螢幕背景遮罩 */}
      <Box 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        bottom={0} 
        bg="blackAlpha.600" 
        zIndex={6000} 
        onClick={onClose} // 點擊這裡會關閉
      />
      
      {/* 2. 調整內容盒 */}
      <VStack
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="90%"
        maxW="400px"
        bg="white"
        p={6}
        borderRadius="20px"
        zIndex={6001} // 確保比遮罩高
        gap={5}
        boxShadow="2xl"
        align="stretch"
        // 關鍵：阻止點擊內容盒時觸發背景的 onClose
        onClick={(e) => e.stopPropagation()} 
      >
        <Text fontSize="xl" fontWeight="bold" color="teal.700" textAlign="center">
          編輯項目：{item.itemName}
        </Text>
        
        {/* 數量調整 */}
        <Stack gap={1}>
          <Text color="#4A3728" fontWeight="bold">數量調整</Text>
          <Input 
            type="number"
            defaultValue={item.num} 
            bg="#FFF9ED" 
            border="2px solid #5B6D5B"
            borderRadius="15px"
            fontSize="xl"
            fontWeight="bold"
            color="#4A3728"
            h="50px"            
            onChange={(e) => setTempNum(Number(e.target.value))}
          />
        </Stack>

        {/* 負責人修改 */}
        <Stack gap={1}>
          <Text color="#4A3728" fontWeight="bold">負責人修改</Text> 
          <Select.Root 
            collection={userCollection} 
            value={[tempManager]} 
            onValueChange={(e) => setTempManager(e.value[0])}
          >
            <Select.Control>
              <Select.Trigger bg="#FFF9ED" border="2px solid #5B6D5B" borderRadius="15px" color="black">
                <Select.ValueText placeholder={tempManager || "選擇人員"} />
              </Select.Trigger>
            </Select.Control>
            
              <Select.Positioner zIndex={7000}>
                <Select.Content bg="white" border="2px solid #5B6D5B">
                  {userCollection.items.map((u) => (
                    <Select.Item item={u} key={u.value} cursor="pointer" color="black">
                      {u.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
          </Select.Root>
        </Stack>

        <CategoryBlock formData={category} setFormData={setCategory} />

        {/* 操作按鈕 */}
        <HStack gap={3} mt={2}>
          <Button 
            flex={1} 
            colorPalette="teal" 
            h="50px" 
            borderRadius="12px"
            onClick={() => onSave({ ...item, num: tempNum, manager: tempManager, category: category })}
          >
            儲存修改
          </Button>
          
          <Button 
            flex={1} 
            variant="outline" 
            color="black" 
            bg="red.500"
            h="50px" 
            borderRadius="12px" 
            onClick={onClose}
          >
            刪除
          </Button>
        </HStack>
      </VStack>
    </Portal>
  );
};