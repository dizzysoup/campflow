import React, { useState, useEffect } from "react";
import { 
  Stack, Accordion, Container, VStack, Text ,Field, SelectRoot ,
  createListCollection , SelectTrigger ,
  SelectItem, SelectContent ,
  SelectValueText,Portal, Flex,Spacer,
  Box,  
  HStack,  SimpleGrid,
  Input,Select,
  Checkbox,Image,
  Button, Dialog
} from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { FaTag, FaCamera } from 'react-icons/fa';
import "./RentalItemCard.css"
import CategoryBlock from "./CategoryBlock";
import { toaster } from "../components/ui/toaster";

export const CreateGearForm = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    num: "",
    manager: "",
    iconpath: "",
    category : ""
  });
  
  const [isIconBlockOpen, setIsIconBlockOpen] = useState(false);
  const [Icon, setIcon] = useState(null);

  const userCollection = createListCollection({
    items: users,
  });

  // 1. 修正：fetchUsers 應該放在 useEffect 裡，否則會無限迴圈請求
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

  
  const handleAdd = async () => {
    const docData = {
      itemName: formData.itemName,
      num: Number(formData.num),
      manager: formData.manager,      
      category: formData.category,
    };
    await addDoc(collection(db, "gear"), docData);
    setFormData({ itemName: "", num: "", manager: "", category: ""});
    toaster.create({
      title: "新增成功",
      description: `已新增物品：${formData.itemName}`,
      type: "success",
   })
    onClose();
  };

  return (
    <Box bg="#86A686" p={6} minH="100vh" >
      <VStack align="stretch" maxW="500px" mx="auto">
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
              value={formData.itemName} // 建議加上 value 變成受控組件
              onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
              _placeholder={{ color: '#A0AEC0' }}
            />
          </HStack>
        </Stack>

        {/* 數量欄位 */}
         <Stack gap={1}>
          <Text color="#4A3728" fontWeight="bold">數量</Text>
            <Input 
              type="number"
              placeholder="1" 
              bg="#FFF9ED" 
              border="2px solid #5B6D5B"
              borderRadius="15px"
              fontSize="xl"
              fontWeight="bold"
              color="#4A3728"
              h="50px"
              onChange={(e) => setFormData(prev => ({ ...prev, num: e.target.value }))}
            />
         </Stack>
        {/* 負責人欄位 */}
        <HStack gap={4} align="flex-end">
        <Stack flex={1} gap={1}>
        <Text color="#4A3728" fontWeight="bold">負責人</Text> 
        <Select.Root 
          collection={userCollection} 
          value={[formData.manager]} 
          onValueChange={(e) => setFormData(prev => ({ ...prev, manager: e.value[0] }))}
        >
          <Select.Control>
            <Select.Trigger color="black">
              <Select.ValueText placeholder={formData.manager || "選擇人員"} />
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner zIndex={2000}>
              <Select.Content bg="white"> {/* 建議加背景色，避免 Portal 後透明 */}
                {userCollection.items.map((u) => (
                  <Select.Item item={u} key={u.value} cursor="pointer" color="black">
                      {u.label}
                      <Select.ItemIndicator /> </Select.Item> ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
         </Stack> 
       </HStack>

        {/* 分類標籤 */}
        <CategoryBlock formData={formData} setFormData={setFormData} />

        {/* 新增按鈕 */}
         <Button 
           bg="#958de3" 
           color="black" 
           h="50px"
           borderRadius="15px"
           borderBottom="4px solid #5B6D5B"
          _hover={{ bg: '#7A8F7A' }}
          mt={4}
          onClick={handleAdd} >
          新增
         </Button>
        </VStack>
    </Box>
  );
};
