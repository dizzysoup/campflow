import { useState } from "react";
import { 
  Box, Flex, HStack, Spacer, Stack, Text, VStack, 
  Checkbox, Badge, Collapsible, IconButton 
} from "@chakra-ui/react";
import { LuChevronDown, LuChevronUp, LuTrash2 } from "react-icons/lu";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";


export const BuyItemCard = ({ item, isSelected, onSelectChange,setRefreshFlag, onEdit, onDelete }) => {
  const [showDetail, setShowDetail] = useState(false);
  
  // 動態追蹤拖動數值
  const x = useMotionValue(0);
  // 根據拖動距離改變背景顏色（滑越多越紅）
  const backgroundColor = useTransform(
    x,
    [0, 150],
    ["rgba(255, 255, 255, 0)", "rgba(255, 0, 0, 0.1)"]
  );

  if (!item) return null;

  const toggleDetail = (e) => {
    e.stopPropagation();
    setShowDetail(!showDetail);
  };

const handleDragEnd = (event, info) => {
    // 判斷滑動距離
    if (info.offset.x > 120) {
      // 為了避免 confirm 視窗阻斷瀏覽器渲染，稍微延遲一點點
      setTimeout(async () => {
        if (window.confirm(`確定要刪除「${item.itemName}」嗎？`)) {         
          onDelete(item.id, item.itemName,setRefreshFlag); // 呼叫父組件的刪除函式        

        } else {         
          animate(x, 0, {
            type: "spring",
            stiffness: 500,
            damping: 40
          });
        }
      }, 50);
    } else {
      // 如果沒滑到位，也確保它彈回 0
      animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
    }
  };

  return (
    <Box position="relative" overflow="hidden" w="100%">
      {/* 底部提示背景（滑開後會看到的內容） */}
      <Flex 
        position="absolute" left={0} top={0} bottom={0} w="150px"
        bg="red.500" color="white" align="center" ps={4} borderRadius="md"
        zIndex={0}
      >
        <LuTrash2 size="20px" />
        <Text ms={2} fontSize="sm" fontWeight="bold">刪除</Text>
      </Flex>

      {/* 主要內容卡片 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 50 }} // 限制滑動範圍
        style={{ x, backgroundColor, zIndex: 1, position: "relative" }}
        onDragEnd={handleDragEnd}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <VStack 
          w="100%" gap={0} py={2} px={2}
          bg="white" // 必須要有背景色，否則會看到底下的刪除文字
          borderBottom="1px solid"
          borderColor="gray.100"
          _hover={{ bg: "gray.50" }}
          align="stretch"
        >
          <HStack w="100%" gap={3} cursor="pointer" onClick={() => onEdit(item)}>
            <Checkbox.Root 
              colorPalette="teal"
              checked={isSelected} 
              onClick={(e) => e.stopPropagation()} 
              onCheckedChange={onSelectChange}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>

            <VStack align="flex-start" gap={0} flex={1}>
              <Text fontSize="md" fontWeight="bold" color="#4A3728" truncate>
                {item.itemName}
              </Text>
              <Text fontSize="xs" color="gray.400">
                ${(item.price * item.num).toLocaleString()} (單價: ${item.price})
              </Text>
            </VStack>

            <Text fontWeight="bold" color="#5B6D5B" fontSize="md" minW="40px" textAlign="right">
              x {item.num}
            </Text>

            <IconButton
              variant="ghost"
              size="xs"
              onClick={toggleDetail}
              color="gray.400"
              _hover={{ color: "teal.600", bg: "teal.50" }}
            >
              {showDetail ? <LuChevronUp /> : <LuChevronDown />}
            </IconButton>
          </HStack>

          {/* 收闔詳情區 */}
          <Collapsible.Root open={showDetail}>
            <Collapsible.Content>
              <HStack mt={2} mb={1} ml={8} align="flex-start" gap={3}>
                <HStack gap={2} align="flex-start">
                  <Text fontSize="xs" fontWeight="bold" color="#8B735B" whiteSpace="nowrap">墊款</Text>
                  <HStack gap={1} flexWrap="wrap">
                    {Array.isArray(item.payers) && item.payers.length > 0 ? (
                      item.payers.map((p, idx) => (
                        <Badge key={idx} size="sm" variant="subtle" borderRadius="md">
                          {p.user} ${p.amount}
                        </Badge>
                      ))
                    ) : (
                      <Text fontSize="xs" color="red.400">尚未設定</Text>
                    )}
                  </HStack>
                </HStack>

                <HStack gap={2} align="flex-start">
                  <Text fontSize="xs" fontWeight="bold" color="#8B735B" whiteSpace="nowrap">分攤</Text>
                  <HStack gap={1} flexWrap="wrap">
                    {item.manager === "平均分擔" ? (
                      <Badge size="sm" variant="outline" color="blue.600">全員平均</Badge>
                    ) : item.assignees?.length > 0 ? (
                      item.assignees.map((assign, idx) => (
                        <Box key={idx} px={1.5} py={0.5} bg="white" border="1px solid #E2E8F0" borderRadius="md">
                          <Text fontSize="xs" color="#4A3728">
                            {assign.user} ({assign.count})
                          </Text>
                        </Box>
                      ))
                    ) : (
                      <Text fontSize="2xs" color="gray.400">未指定</Text>
                    )}
                  </HStack>
                </HStack>
              </HStack>
            </Collapsible.Content>
          </Collapsible.Root>
        </VStack>
      </motion.div>
    </Box>
  );
};