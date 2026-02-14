// 修改匯入部分
import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import { keyframes } from "@emotion/react"; // 從這裡匯入
import { FaHammer, FaGear } from "react-icons/fa6";

// 定義齒輪旋轉動畫
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 定義槌子敲擊動畫
const hammer = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(-35deg); }
  100% { transform: rotate(0deg); }
`;

function ClaimPage() {
  const spinAnimation = `${spin} infinite 4s linear`;
  const hammerAnimation = `${hammer} infinite 0.8s ease-in-out`;

  return (
    <Box p={4} minH="60vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={8} textAlign="center">
        {/* 標題區塊 */}
        <Box>
          <Text
            color="#4A3728"
            fontWeight="bold"
            fontSize="3xl"
            letterSpacing="wider"
          >
            費用分擔結算
          </Text>
        </Box>

        {/* 施工動畫視覺區塊 */}
        <Box position="relative" py={10}>
          {/* 大齒輪背景 */}
          <Icon
            as={FaGear}
            w={20}
            h={20}
            color="gray.100"
            animation={spinAnimation}
            position="absolute"
            top="0"
            left="50%"
            ml="-40px"
            zIndex={-1}
          />
          
          {/* 槌子主體 */}
          <Box animation={hammerAnimation}>
            <Icon as={FaHammer} w={16} h={16} color="#000000" />
          </Box>
        </Box>

        {/* 文字說明區塊 */}
        <VStack spacing={3}>
          <Text
            px={4}
            py={1}
            bg="#FAEDCD" // 柔和的淺黃色，像施工膠帶的文青版
            color="#4A3728"
            fontWeight="bold"
            borderRadius="full"
            fontSize="md"
          >
            🚧 頁面建設中 Under Construction 🚧
          </Text>
          
          <Text color="#4A3728" fontSize="lg" maxW="300px">
            還沒寫完..           
          </Text>
        </VStack>

        {/* 底部裝飾條 (黃黑施工條的文青配色版) */}
        <Box 
          w="200px" 
          h="4px" 
          bgGradient="linear(to-r, #CCD5AE 25%, #E9EDC6 25%, #E9EDC6 50%, #CCD5AE 50%, #CCD5AE 75%, #E9EDC6 75%)" 
          backgroundSize="40px 100%"
        />
      </VStack>
    </Box>
  );
}

export default ClaimPage;