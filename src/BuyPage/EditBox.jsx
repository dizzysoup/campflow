import { useState, useMemo } from "react";
import { 
  Box, Portal, VStack, Text, Stack, Input, 
  HStack, Button, Textarea, SimpleGrid 
} from "@chakra-ui/react";
import { SelectManagerBlock } from "./SelectManagerBlock";

// 修改視窗的格子
export const EditBox = ({ item, onClose, onSave, userCollection }) => {
  const [tempNum, setTempNum] = useState(item.num || 1);
  const [tempPrice, setTempPrice] = useState(item.price || 0); // 加入單價狀態
  const [tempManager, setTempManager] = useState(item.manager); 
  const [assignees, setAssignees] = useState(item.assignees || []); 
  const [tempNote, setTempNote] = useState(item.note || "");
  const [category, setCategory] = useState({ category: item.category || "" });

  // 即時計算總價
  const totalPrice = useMemo(() => {
    return (Number(tempNum) || 0) * (Number(tempPrice) || 0);
  }, [tempNum, tempPrice]);

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
        onClick={onClose} 
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
        zIndex={6001}
        gap={4}
        boxShadow="2xl"
        align="stretch"
        onClick={(e) => e.stopPropagation()} 
      >
        <Text fontSize="xl" fontWeight="bold" color="teal.700" textAlign="center">
          編輯項目：{item.itemName}
        </Text>
        
        {/* 數量與單價調整 */}
        <SimpleGrid columns={2} gap={4}>
          <Stack gap={1}>
            <Text color="#4A3728" fontWeight="bold">數量</Text>
            <Input 
              type="number"
              value={tempNum} 
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

          <Stack gap={1}>
            <Text color="#4A3728" fontWeight="bold">單價 ($)</Text>
            <Input 
              type="number"
              value={tempPrice} 
              bg="#FFF9ED" 
              border="2px solid #5B6D5B"
              borderRadius="15px"
              fontSize="xl"
              fontWeight="bold"
              color="#4A3728"
              h="50px"            
              onChange={(e) => setTempPrice(Number(e.target.value))}
            />
          </Stack>
        </SimpleGrid>

        {/* 總額預覽區塊 */}
        <Box 
          bg="#F0F4F0" 
          p={2} 
          borderRadius="12px" 
          borderLeft="4px solid #5B6D5B"
          textAlign="right"
        >
          <HStack justify="flex-end" gap={2}>
            <Text color="#5B6D5B" fontSize="xs">預估總額：</Text>
            <Text color="#4A3728" fontSize="lg" fontWeight="black">
              ${totalPrice.toLocaleString()}
            </Text>
          </HStack>
        </Box>

        <SelectManagerBlock
          manager={tempManager}
          setManager={setTempManager}
          assignees={assignees}
          setAssignees={setAssignees}
          userCollection={userCollection}
        />
        
        <Stack gap={1}>
          <Text color="#4A3728" fontWeight="bold">備註：</Text>
          <Textarea 
            placeholder="請輸入備註資訊..."
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            bg="#FFF9ED"
            border="2px solid #5B6D5B"
            borderRadius="15px"
            color="black"
            _focus={{ borderColor: "teal.500" }}
            resize="none"
            rows={2}
          />
        </Stack>

        {/* 操作按鈕 */}
        <HStack gap={3} mt={2}>
          <Button 
            flex={1} 
            bg="teal.600"
            _hover={{ bg: "teal.700" }}
            color="white"
            h="50px" 
            borderRadius="12px"
            onClick={() => onSave({ 
              ...item,            
              num: tempNum, 
              price: tempPrice, // 儲存修改後的單價
              manager: tempManager, 
              category: category.category,
              note: tempNote,
              assignees: assignees
            })}
          >
            儲存修改
          </Button>
          
          <Button 
            flex={1} 
            variant="ghost" 
            color="gray.600"
            border="1px solid"
            borderColor="gray.300"
            h="50px" 
            borderRadius="12px" 
            onClick={onClose}
          >
            取消
          </Button>
        </HStack>
      </VStack>
    </Portal>
  );
};