import { useState } from "react";
import { 
  Box, Portal, VStack, Text, Stack, Input, 
  HStack, Button, Select, Textarea 
} from "@chakra-ui/react";
import CategoryBlock from "./CategoryBlock";
import {SelectManagerBlock} from "./SelectManagerBlock";

// 修改視窗的格子
export const EditBox = ({ item, onClose, onSave, userCollection }) => {
  const [tempNum, setTempNum] = useState(item.num);
  const [tempManager, setTempManager] = useState(item.manager); // 負責人修改的暫存狀態
  const [assignees, setAssignees] = useState(item.assignees || []); // 多人指派的細節資料

  // 新增備註狀態，預設為 item 原有的備註或空字串
  const [tempNote, setTempNote] = useState(item.note || "");
  
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
        gap={5}
        boxShadow="2xl"
        align="stretch"
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

        <SelectManagerBlock
          manager={tempManager}
          setManager={setTempManager}
          assignees={assignees}
          setAssignees={setAssignees}
          userCollection={userCollection}
        />

          {/* 分類選擇 */}
        <CategoryBlock formData={category} setFormData={setCategory} />

        
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
            resize="none" // 防止使用者隨意拉伸破壞排版
            rows={3}
          />
        </Stack>

        {/* 操作按鈕 */}
        <HStack gap={3} mt={2}>
          <Button 
            flex={1} 
            colorPalette="teal" 
            h="50px" 
            borderRadius="12px"
            onClick={() => onSave({ 
              ...item,            
              num: tempNum, 
              manager: tempManager, 
              category: category.category, // 注意這裡取 category 裡的值
              note: tempNote ,
              assignees: assignees
            })}
          >
            儲存修改
          </Button>
          
          <Button 
            flex={1} 
            variant="outline" 
            color="white" 
            bg="red.500"
            _hover={{ bg: "red.600" }}
            h="50px" 
            borderRadius="12px" 
            onClick={onClose}
          >
            關閉
          </Button>
        </HStack>
      </VStack>
    </Portal>
  );
};