import { useState, useMemo } from "react";
import { 
  Box, Portal, VStack, Text, Stack, Input, 
  HStack, Button, Textarea, SimpleGrid 
} from "@chakra-ui/react";
import { SelectManagerBlock } from "../../BuyPage/SelectManagerBlock";
import { PaymentPayerBlock } from "../../BuyPage/PaymentPayerBlock";

// 修改視窗的格子
export const EditBox = ({ item, onClose, onSave, userCollection  }) => {
  const [tempNum, setTempNum] = useState(item.num || 1);
  const [tempPrice, setTempPrice] = useState(item.price || 0); // 加入單價狀態
  const [tempManager, setTempManager] = useState(item.manager); 
  const [assignees, setAssignees] = useState(item.assignees || []); 
  const [tempNote, setTempNote] = useState(item.note || "");
  const [category, setCategory] = useState({ category: item.category || "" });
  const [payers, setPayers] = useState(item.payers || []); // 誰先付款的個人資訊

  // 即時計算總價
  const totalPrice = useMemo(() => {
    return (Number(tempNum) || 0) * (Number(tempPrice) || 0);
  }, [tempNum, tempPrice]);

 return (
    <Portal>
      {/* 1. 全螢幕背景遮罩 */}
      <Box 
        position="fixed" top={0} left={0} right={0} bottom={0} 
        bg="blackAlpha.600" zIndex={6000} onClick={onClose} 
      />
      
      {/* 2. 調整內容盒 */}
      <VStack
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="90%"
        maxW="400px"
        // --- 重點：限制最大高度並允許內部滾動 ---
        maxH="85vh" 
        bg="white"
        borderRadius="24px" // 圓角稍微加大更有質感
        zIndex={6001}
        gap={0} // 這裡改為 0，改用內部 padding 控制
        boxShadow="2xl"
        align="stretch"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* 固定標題區 */}
        <Box p={6} pb={2}>
          <Text fontSize="xl" fontWeight="bold" color="teal.700" textAlign="center">
            編輯項目：{item.itemName}
          </Text>
        </Box>

        {/* --- 中間可滾動區域 --- */}
        <Box 
          flex="1" 
          overflowY="auto" 
          px={6} 
          py={2}
          // 客製化滾動條樣式（可選）
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '10px' },
          }}
        >
          <VStack gap={4} align="stretch">
            {/* 數量與單價調整 */}
            <SimpleGrid columns={2} gap={4}>
              <Stack gap={1}>
                <Text color="#4A3728" fontWeight="bold">數量</Text>
                <Input 
                  type="number"
                  value={tempNum} 
                  bg="#FFF9ED" border="2px solid #5B6D5B" borderRadius="15px"
                  fontSize="xl" fontWeight="bold" color="#4A3728" h="50px"
                  onChange={(e) => setTempNum(Number(e.target.value))}
                />
              </Stack>
              <Stack gap={1}>
                <Text color="#4A3728" fontWeight="bold">單價 ($)</Text>
                <Input 
                  type="number"
                  value={tempPrice} 
                  bg="#FFF9ED" border="2px solid #5B6D5B" borderRadius="15px"
                  fontSize="xl" fontWeight="bold" color="#4A3728" h="50px"
                  onChange={(e) => setTempPrice(Number(e.target.value))}
                />
              </Stack>
            </SimpleGrid>

            {/* 總額預覽區塊 */}
            <Box bg="#F0F4F0" p={3} borderRadius="12px" borderLeft="4px solid #5B6D5B" textAlign="right">
              <HStack justify="flex-end" gap={2}>
                <Text color="#5B6D5B" fontSize="xs">預估總額：</Text>
                <Text color="#4A3728" fontSize="lg" fontWeight="black">
                  ${totalPrice.toLocaleString()}
                </Text>
              </HStack>
            </Box>

            {/* 誰先付款區 */}
            <PaymentPayerBlock
              payers={payers}
              setPayers={setPayers}
              userCollection={userCollection}
              totalPrice={totalPrice}
             />

            {/* 分攤者指派區  */}
            <SelectManagerBlock
              manager={tempManager}
              setManager={setTempManager}
              assignees={assignees}
              setAssignees={setAssignees}
              userCollection={userCollection}
              price={tempPrice}
              totalPrice={totalPrice}
            />
            
            <Stack gap={1}>
              <Text color="#4A3728" fontWeight="bold">備註：</Text>
              <Textarea 
                placeholder="請輸入備註資訊..."
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                bg="#FFF9ED" border="2px solid #5B6D5B" borderRadius="15px"
                color="black" _focus={{ borderColor: "teal.500" }}
                resize="none" rows={2}
              />
            </Stack>
          </VStack>
        </Box>

        {/* 固定底部按鈕區 */}
        <Box p={6} pt={2}>
          <HStack gap={3}>
            <Button 
              flex={1} bg="teal.600" _hover={{ bg: "teal.700" }} color="white" h="50px" borderRadius="12px"
              onClick={() => onSave({ 
                ...item, num: tempNum, price: tempPrice,
                manager: tempManager,
                note: tempNote, assignees: assignees,payers: payers,
              })}
            >
              儲存修改
            </Button>
            <Button 
              flex={1} variant="ghost" color="gray.600" border="1px solid" borderColor="gray.300"
              h="50px" borderRadius="12px" onClick={onClose}
            >
              取消
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Portal>
  );
};