import React, { useState, useEffect } from "react";
import { 
  Stack, Accordion, Container, VStack, Text ,Field, SelectRoot ,
  createListCollection , SelectTrigger ,
  SelectItem, SelectContent ,
  SelectValueText,Portal, Flex,Spacer,
  Box,  
  HStack,  
  Input,
  Checkbox,Image,
  Button, Dialog
} from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { FaTag, FaCamera } from 'react-icons/fa';
import "./RentalItemCard.css"



// 新增項目UI
export const CreateExpenseForm = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    manager: "",
    splitMethod: ""
  });
  const userCollection = createListCollection({
    items: users,
  });

    const [isIconBlockOpen, setIsIconBlockOpen] = useState(false);
    const [Icon , setIcon] = useState(null);

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map(doc => ({
            label: doc.data().uname,
            value: doc.data().uname, 
        }));
        
        setUsers(userList);     
        };
    fetchUsers();
    
    // 選取icon的底部彈出區塊
    const IconBlock = () => { 
        
        const iconModules = import.meta.glob('../icons/*.{png,jpg,svg}', { eager: true });
        const iconList = Object.values(iconModules).map((mod) => mod.default);    

        return (
        <>
            {/* 遮罩層 */}
            <Box 
            position="fixed" 
            top={0} left={0} right={0} bottom={0} 
            bg="blackAlpha.500"
            zIndex={100} 
            onClick={() => setIsIconBlockOpen(false)} 
            />

            {/* 底部內容盒 */}
            <Box 
            position="fixed" 
            bottom={0} 
            left="50%" 
            transform="translateX(-50%)" 
            w="full" 
            maxW="500px" 
            bg="#FFF9ED" 
            p={6} 
            pl={2}
            borderTopRadius="30px" 
            border="3px solid #5B6D5B"
            borderBottom="none"
            zIndex={101}
            boxShadow="0 -10px 25px rgba(0,0,0,0.15)"
            >
            {/* 橫向排列容器：加上 overflowX="auto" 確保圖片多時可以滑動 */}
            <HStack 
                gap={4} 
                overflowX="auto" 
                py={2} 
                px={1}
                css={{
                '&::-webkit-scrollbar': { display: 'none' }, // 隱藏捲動條讓畫面更乾淨
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                }}
            >
                {iconList.map((src, index) => (
                <Box
                    key={index}
                    flexShrink={0}
                    cursor="pointer"
                    transition="all 0.2s" 
                    _hover={{ transform: "scale(1.15)" }} 
                    onClick={() => {
                    console.log("選中了:", src);
                    setIsIconBlockOpen(false);
                    setIcon(src); 
                    }}
                >
                    <Image 
                    src={src} 
                    alt={`icon-${index}`}                
                    boxSize="90px" 
                    objectFit="contain"
                    borderRadius="10px" 
                    bg="white" 
                    p={2} 
                    border="4px solid #000000" 
                    
                    _hover={{ 
                        borderColor: "#5B6D5B"
                    }}
                    />
                </Box>
                ))}
            </HStack>
            </Box>
        </>
        );
    }

    const handleAdd = () => {
    
      const docData = {
        itemName: formData.itemName,
        price: Number(formData.price),
        manager: formData.manager, //負責人
        splitMethod: formData.splitMethod, //分款方式
        createdAt: serverTimestamp() 
      }
      console.log(docData);
      addDoc(collection(db, "rentals"), docData);
      alert("新增成功！");

      // 3. 清空表單
      setFormData({ itemName: "", price: "", manager: "", splitMethod: "" });
    
    };

    return (
      <Box bg="#86A686" p={6} minH="100vh">
        <VStack gap={5} align="stretch" maxW="500px" mx="auto">
          
          {/* 標題欄位 */}
          <Stack gap={1}>
            <Text color="#4A3728" fontWeight="bold">標題</Text>
            <HStack gap={2}>
              <Input 
                placeholder="例如：飲料" 
                bg="#FFF9ED" 
                border="2px solid #5B6D5B"
                color="black"
                borderRadius="15px"
                fontSize="xl"
                _placeholder={{ color: '#A0AEC0' }}
              />
            
              <Box 
                  as="button" 
                  p={2} 
                  bg="#FFF9ED" 
                  border="2px solid #5B6D5B" 
                  borderRadius="15px"
                  onClick={() => setIsIconBlockOpen(!isIconBlockOpen)}
                >
                  <FaTag color="#A67C52" />
                </Box>

              {/* 4. 根據狀態顯示 IconBlock */}
              {isIconBlockOpen && <IconBlock />}

              <Box as="button" p={2} bg="#FFF9ED" border="2px solid #5B6D5B" borderRadius="15px">
                <FaCamera color="#5B6D5B" />
              </Box>
            </HStack>
          </Stack>

          {/* 金額欄位 */}
          <Stack gap={1}>
            <Text color="#4A3728" fontWeight="bold">金額</Text>
            <Input 
              type="number"
              placeholder="0.00" 
              bg="#FFF9ED" 
              border="2px solid #5B6D5B"
              borderRadius="15px"
              fontSize="xl"
              fontWeight="bold"
              color="#4A3728"
              h="50px"
            />
          </Stack>

          <HStack gap={4} align="flex-end">
            <Stack flex={1} gap={1}>
              <Text color="#4A3728" fontWeight="bold">支付者(負責人)</Text>
              <SelectRoot 
                  collection={userCollection} 
                  onValueChange={(e) => setFormData(prev => ({ ...prev, manager: e.value[0] }))}                        
              >
                  <SelectTrigger color="black">
                    <SelectValueText placeholder={formData.manager || "選擇人員"} />
                  </SelectTrigger>                        
                  <SelectContent >
                    {userCollection.items.map((u) => (
                      <SelectItem item={u} key={u.value}>{u.label}</SelectItem>
                      ))}
                  </SelectContent>                       
              </SelectRoot>
            </Stack>         
          </HStack>

          <Box mt={2}>
            <HStack justify="space-between" mb={3}>
              <HStack>
                <Text fontWeight="bold" color="#4A3728">分攤</Text>   
                <Spacer />           
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                <Text fontSize="sm" color="#4A3728">平均分攤</Text>              
              </HStack>
            
            </HStack>

            <Box bg="#FFF9ED" p={4} borderRadius="15px" border="2px solid #5B6D5B">
              <VStack align="stretch" gap={3}>
                {userCollection.items.map((user) => (
                  <HStack key={user.value} justify="space-between">
                    {/* 左側：Checkbox + 姓名 */}
                    <HStack gap={3}>
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        style={{ 
                          width: '18px', 
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#5B6D5B' // 讓 Checkbox 顏色跟你的邊框一致
                        }} 
                      />
                      <Text color="#4A3728" fontWeight="medium">
                        {user.label}
                      </Text>
                    </HStack>

                    {/* 右側：動態計算的金額 */}
                    <Text color="#4A3728" fontWeight="bold">
                      $ {formData.price ? (Number(formData.price) / userCollection.items.length).toFixed(2) : "0.00"}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Box>

          {/* 新增按鈕 */}
          <Button 
            bg="#958de3" 
            color="black" 
            h="50px"
            borderRadius="15px"
            borderBottom="4px solid #5B6D5B"
            _hover={{ bg: '#7A8F7A' }}
            mt={4}
          >
            新增
          </Button>
        </VStack>
      </Box>
    );
};
