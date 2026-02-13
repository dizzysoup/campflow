import { useState, useEffect } from "react";
import { Box, Text, Button, Dialog, Flex , Spacer , Image } from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, getDocs , doc , updateDoc } from "firebase/firestore";
import { CreateGearForm } from "./CreateGearForm";
import { motion } from "framer-motion";
import { HStack,Checkbox,VStack } from "@chakra-ui/react";
import { EditBox } from "./EditBox";
import { createListCollection } from "@chakra-ui/react"; 


const GearlItemCard = ({ item, isSelected, onSelectChange, onEdit }) => {
  if (!item) return null;

  // 定義分類清單
  const categories = [
    { id: "cooking", label: "炊事與餐廚", icon: "🍳" },
    { id: "furniture", label: "營地家具", icon: "🪑" },
    { id: "sleep", label: "寢室睡眠", icon: "⛺" },
    { id: "electric", label: "燈光電器", icon: "💡" },
    { id: "sanitary", label: "衛生防蟲", icon: "🧴" },
    { id: "others", label: "其他物品", icon: "📦" },
  ];
  
  // 根據 item 內的 category ID 找到對應的物件
  const categoryInfo = categories.find(c => c.label === item.category) || { label: "未分類", icon: "❓" };

  return (
    <HStack 
      w="100%" gap={4} py={3} px={2}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
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
        {/* 第一排：標題 與 數量 */}
        <HStack w="100%" justify="space-between">
          <Text fontSize="lg" fontWeight="bold" color="#4A3728" truncate>
            {item.itemName}
          </Text>
          <Text fontWeight="bold" color="#5B6D5B" fontSize="md">
            x {item.num}
          </Text>
        </HStack>

        

        <Flex w="100%" align="center">                 
          <Text fontSize="sm" color="gray.500">
              負責人：{item.manager || "未指定"}
          </Text>
          <Spacer />
          <Box 
            px={2} 
            py={0.5} 
            bg="#F0F4F0" 
            borderRadius="full" 
            border="1px solid #C5D1C5"
          >
            <Text fontSize="xs" color="#5B6D5B">
              {categoryInfo.icon} {categoryInfo.label}
            </Text>
          </Box>

          
        </Flex>
      </VStack>
    </HStack>
  );
};



function GearPage(){
  const [rentalsList, setRentalsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [users, setUsers] = useState([]);  
  
  const userCollection = createListCollection({
    items: users,
  });

  useEffect(() => {
    const fetchRentalsList = async () => {
      const querySnapshot = await getDocs(collection(db, "gear"));
      const rentalsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,               
          itemName: data.itemName, // 帳篷
          manager: data.manager, // 負責人
          iconpath : data.iconpath, // 圖片路徑  
          category: data.category, // 分類        
          num: data.num 
        };
      });
      setRentalsList(rentalsData);     
    };
    fetchRentalsList();

  }, [open,editingItem]);

   useEffect(() => {
      const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map(doc => ({
          label: doc.data().uname,
          value: doc.data().uname,
        }));
        const placeholderOption = { label: "從缺", value: "從缺" };
        setUsers([placeholderOption, ...userList]);
      };
      fetchUsers();
    }, []);

  return (
    <Box >
      <Box textAlign="center" mt="5%">
        <Text color="#4A3728" fontWeight="bold">要攜帶的東西</Text>
      </Box> 

    <Box 
      ml="5%" mr="5%" mt="2%" mb="25%" 
      bg="white" borderRadius="15px" p="2"
      divideY="2px"
    >
      {rentalsList.map(item => (
        <GearlItemCard 
          key={item.id} 
          item={item} 
          onEdit={(selectedItem) => setEditingItem(selectedItem)} // 點擊時設定編輯對象
        />
      ))}

      {editingItem && (
          <EditBox 
            item={editingItem} 
            onClose={() => setEditingItem(null)} 
            userCollection={userCollection} // 將名單傳入
            onSave={ async (newData ) => {
             try {
                  // 1. 取得該文件的引用 (注意：newData 必須包含當初從 Firebase 抓下來的 id)
                  const gearRef = doc(db, "gear", newData.id); 

                  // 2. 使用 updateDoc 而不是 addDoc
                  await updateDoc(gearRef, {
                    num: Number(newData.num),      // 確保是數字
                    manager: newData.manager,
                    category: newData.category.category ?? "" // 處理你提到的 category 預設值
                  });
                  console.log(newData);
                  setEditingItem(null); // 關閉編輯視窗
                } catch (error) {
                  console.error("更新失敗：", error);
                }
            }}
          />
        )}
    </Box>

      <Box 
        position="fixed" 
        bottom="40px" 
        left="50%"    
        transform="translateX(-50%)"
        zIndex={10}
          
      >
        <Button 
          onClick={() => setOpen(true)}
          bg="#958de3" 
          color="black" 
          borderRadius="20px"          
          borderBottom="4px solid #5B6D5B"          
          px={8}
          _hover={{ bg: '#7A8F7A' }}
        >
          新增用具
        </Button>
      </Box>     
    
    <Dialog.Root 
            placement="bottom" 
            open={open} 
            onOpenChange={(e) => setOpen(e.open)}
            motionPreset="slide-in-bottom"
            closeOnInteractOutside={false}
          >
            <Dialog.Backdrop /> 
            
            <Dialog.Content           
             as={motion.div} 
             drag="y"
             dragConstraints={{ top: 0, bottom: 0 }}
             dragElastic={{ top: 0, bottom: 0.5 }} 
              onDragEnd={(e, info) => {
                if (info.offset.y > 150) {
                  setOpen(false);
                }
              }}
              position="fixed"
              bottom="-5%" 
              left="0" 
              right="0" 
              h="auto"
              maxH="50vh"
              bg="#86A686" 
              borderTopRadius="30px" 
              p={0}              
              display="flex"
              flexDirection="column"
            >
              {/* 拖曳手把區塊 */}
              <Box 
                w="100%" 
                py={4} // 稍微加寬一點更好點擊
                display="flex" 
                justifyContent="center" 
                cursor="grab"
                _active={{ cursor: "grabbing" }}
                flexShrink={0} // 確保手把不會因為內容多而被壓縮
              >
                <Box 
                  w="40px" 
                  h="5px" 
                  bg="whiteAlpha.800" // 顏色調亮一點比較顯眼
                  borderRadius="full" 
                />
              </Box>
    
              {/* 內容區塊 */}
              <Dialog.Body 
                p={0}            
                overflowY="auto"  
                flex="1" // 讓內容區自動填滿剩餘高度
              >
                <CreateGearForm onClose={() => setOpen(false)} />
              </Dialog.Body>
            </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}

export default GearPage;