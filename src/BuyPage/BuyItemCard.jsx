
import { Box, Flex, HStack, Spacer, Stack, Text, VStack,Checkbox } from "@chakra-ui/react";


export const BuyItemCard = ({ item, isSelected, onSelectChange, onEdit }) => {
  if (!item) return null;


  const renderManagerInfo = () => {
    // 1. 判斷是否為「各自準備」
    if (item.manager === "各自準備" || item.isIndividual === true) {
      return (
        <Text fontSize="sm" color="teal.600" fontWeight="bold">
          👥 全員各自準備
        </Text>
      );
    }

    // 2. 判斷是否有多人指派的細節資料
    if (Array.isArray(item.assignees) && item.assignees.length > 0) {
      return (
        <HStack gap={1} flexWrap="wrap">
          <Text fontSize="sm" color="gray.500">負責：</Text>
          {item.assignees.map((assign, idx) => (            
            assign.user && (
              <Box 
                key={idx} 
                px={2} 
                bg="#FFF9ED" 
                color="black"
                border="1px solid #D2B48C" 
                borderRadius="md"
              >
                <Text fontSize="xs" color="#4A3728">
                  {assign.user} ({assign.count})
                </Text>
              </Box>
            )
          ))}
        </HStack>
      );
    }

    // 3. 回退機制：顯示舊有的 manager 字串或從缺
    return (
      <Text fontSize="sm" color="gray.500">
        負責人：{item.manager || "未指定"}
      </Text>
    );
  };

  return (
    <HStack 
      w="100%" gap={4} py={3} px={2}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      borderBottom="1px solid"
      borderColor="gray.100"
      onClick={() => onEdit(item)} 
    >
      <Checkbox.Root 
        colorPalette="teal"
        checked={isSelected} 
        onClick={(e) => e.stopPropagation()} 
        onCheckedChange={onSelectChange}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>

      <VStack align="flex-start" gap={1} flex={1}>
        {/* 第一排：標題 與 總數量 */}
        <Flex w="100%" >
          <Text fontSize="lg" fontWeight="bold" color="#4A3728" truncate>
            {item.itemName}
          </Text>

         
          
           <Spacer />
          <Text fontWeight="bold" color="#5B6D5B" fontSize="md">
            x {item.num}
          </Text>
        </Flex>

        {/* 第二排：負責人資訊 (自適應高度) */}
        <Box w="100%">
          {renderManagerInfo()}
        </Box>  
      </VStack>
    </HStack>
  );
};

