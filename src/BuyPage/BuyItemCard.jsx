import { useState } from "react";
import { 
  Box, Flex, HStack, Spacer, Stack, Text, VStack, 
  Checkbox, Badge, Collapsible, IconButton 
} from "@chakra-ui/react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export const BuyItemCard = ({ item, isSelected, onSelectChange, onEdit }) => {
  const [showDetail, setShowDetail] = useState(false); // 控制收闔狀態

  if (!item) return null;

  // 阻止冒泡並切換收闔
  const toggleDetail = (e) => {
    e.stopPropagation();
    setShowDetail(!showDetail);
  };

  return (
    <VStack 
      w="100%" gap={0} py={2} px={2}
      borderBottom="1px solid"
      borderColor="gray.100"
      _hover={{ bg: "gray.50" }}
      align="stretch"
    >
      <HStack w="100%" gap={3} cursor="pointer" onClick={() => onEdit(item)}>
        {/* 選取框 */}
        <Checkbox.Root 
          colorPalette="teal"
          checked={isSelected} 
          onClick={(e) => e.stopPropagation()} 
          onCheckedChange={onSelectChange}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>

        {/* 主要資訊區 */}
        <VStack align="flex-start" gap={0} flex={1}>
          <Text fontSize="md" fontWeight="bold" color="#4A3728" truncate>
            {item.itemName}
          </Text>
          <Text fontSize="xs" color="gray.400">
            ${(item.price * item.num).toLocaleString()} (單價: ${item.price})
          </Text>
        </VStack>

        {/* 數量顯示 */}
        <Text fontWeight="bold" color="#5B6D5B" fontSize="md" minW="40px" textAlign="right">
          x {item.num}
        </Text>

        {/* 收闔切換按鈕 */}
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

      {/* 可收闔的詳細資訊區塊 */}
      <Collapsible.Root open={showDetail}>
        <Collapsible.Content >
            <HStack mt={2} mb={1} ml={8}  align="flex-start" gap={3}>
              
              {/* 墊款者 */}
              <HStack gap={2} align="flex-start">
                <Text fontSize="xs" fontWeight="bold" color="#8B735B" whiteSpace="nowrap">墊款</Text>
                <HStack gap={1} flexWrap="wrap">
                  {Array.isArray(item.payers) && item.payers.length > 0 ? (
                    item.payers.map((p, idx) => (
                      <Badge key={idx} size="sm" variant="subtle"  borderRadius="md">
                        {p.user} ${p.amount}
                      </Badge>
                    ))
                  ) : (
                    <Text fontSize="xs" color="red.400">尚未設定</Text>
                  )}
                </HStack>
              </HStack>

              {/* 分攤者 */}
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
  );
};