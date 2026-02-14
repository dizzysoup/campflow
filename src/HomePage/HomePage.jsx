import { useNavigate } from "react-router-dom";
import { 
  Box, Heading, Text, Image, VStack, HStack, 
  Badge, Separator, Card, Stack 
} from "@chakra-ui/react";
import { LuMapPin, LuCalendarDays, LuInfo, LuDroplets } from "react-icons/lu";


function HomePage(){

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
  };

  return (
    <Box maxW="600px" mx="auto" p={4} minH="100vh">
      {/* 標題與基礎資訊區塊 */}
      <VStack align="stretch" gap={4} mb={6}>
        <Box textAlign="center" py={4}>
          <Heading size="2xl" color="#4A3728" mb={2} letterSpacing="tight">
            ⛺ 王幾蛋露營去
          </Heading>
          <HStack justify="center" gap={4}>
            <Badge colorPalette="teal" variant="surface" px={3} py={1} borderRadius="full">
              <LuCalendarDays /> 2026/03/13 - 03/15
            </Badge>
            <Badge colorPalette="orange" variant="surface" px={3} py={1} borderRadius="full">
              <LuMapPin /> 小路營區
            </Badge>
          </HStack>
        </Box>

        {/* 營區地圖 */}
        <Card.Root overflow="hidden" borderRadius="xl" boxShadow="sm">
          <Image 
            src="../../src/Images/maps.png" 
            alt="營區地圖" 
            objectFit="cover"
            maxH="300px"
          />
          <Card.Body p={3}>
            <HStack color="#5B6D5B">
              <LuInfo />
              <Text fontWeight="bold" fontSize="sm">營區全區配置圖</Text>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* 營位資訊 */}
        <Box bg="white" p={5} borderRadius="20px" border="2px solid #E2E8F0">
          <Heading size="md" color="#4A3728" mb={3} display="flex" alignItems="center" gap={2}>
            🪵 我們租的地方：大赤鼯鼠區
          </Heading>
          <Text color="gray.600" mb={4}>
            營位配置為木棧板地板，現場貌似備有一個專屬洗手台，方便清洗食材。
          </Text>
          <Image 
            src="../../src/Images/camping_mouse.png" 
            alt="大赤鼯鼠區" 
            borderRadius="lg" 
            mb={2}
          />
        </Box>

        {/* 衛浴設備 - 分類呈現 */}
        <Box>
          <Heading size="md" color="#4A3728" mt={4} mb={4} display="flex" alignItems="center" gap={2}>
            <LuDroplets color="#3182CE" /> 衛浴與公共設施
          </Heading>
          
          <Stack gap={4}>
            {/* 新衛浴 */}
            <Card.Root variant="subtle" bg="blue.50">
              <Card.Body p={4}>
                <Badge colorPalette="blue" mb={2}>新蓋設施 (較遠)</Badge>
                <Text fontSize="sm" color="blue.800" mb={3}>
                  環境較乾淨，設有公共飲水機及冰箱，適合存放冷藏食物。
                </Text>  
                <VStack gap={2} align="center" w="100%">
                  <Image src="../../src/Images/bathroom.png" w="100%" borderRadius="md" alt="新衛浴1" />
                  <Image src="../../src/Images/bathroom2.png" w="100%" borderRadius="md" alt="新衛浴2" />
                </VStack>             
                </Card.Body>
            </Card.Root>

            {/* 舊衛浴 */}
            <Card.Root variant="subtle" bg="gray.100">
              <Card.Body p={4}>
                <Badge colorPalette="gray" mb={2}>舊式衛浴 (較近)</Badge>
                <Text fontSize="sm" color="gray.600">
                  離大赤鼯鼠區較近，但環境較為簡陋髒亂。
                </Text>
                <Image 
                  src="../../src/Images/bathroom3.png" 
                  borderRadius="md" 
                  mt={3} 
                  alt="舊衛浴" 
                  w="80%"
                  sizes={200}
                />
              </Card.Body>
            </Card.Root>

            {/* 公共區域 */}
            <Box bg="#FFF9ED" p={4} borderRadius="xl" borderLeft="4px solid #F0B236">
              <Heading size="sm" color="#B45309" mb={1}>🎮 二樓公共空間</Heading>
              <Text fontSize="sm" color="#B45309" mb={3}>
                可以租借桌遊、吹冷氣避暑，現場亦有提供飲料點餐服務。
              </Text>
              <Image 
                src="../../src/Images/hell.png" 
                borderRadius="lg" 
                alt="公共空間" 
              />
            </Box>
          </Stack>
        </Box>
      </VStack>
      
      {/* 底部預留空間 */}
      <Box h="100px" />
    </Box>
  )
}

export default HomePage;