import React, { useState, useEffect } from "react";
import { 
  Stack, Accordion, Container, VStack, Text ,Field, SelectRoot ,
  createListCollection , SelectTrigger ,
  SelectItem, SelectContent ,
  SelectValueText,Portal, Flex,Spacer,Textarea,
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
import { create } from "framer-motion/m";
import { SelectManagerBlock } from "./SelectManagerBlock";

export const CreateGearForm = ({ onClose , userCollection }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    num: "",    
    iconpath: "",
    category : "",
    note : "",
    manager: "", // 負責人
    assignees: [{ userId: "", count: 1 }] // 多人指派
  }); 

  const [tempManager, setTempManager] = useState(""); // 選擇負責人的方式
  const [tempAssignments, setTempAssignments] = useState([]); // 多人指派的細節資料


  const handleAdd = async () => {
    const authStatus = localStorage.getItem("auth");
    if (authStatus === "guest") {
        toaster.create({ 
          title: "權限不足", 
          description: "訪客模式僅供瀏覽，請登入後再操作。", 
          type: "error" 
        });
        return;
    }  
    if (!tempManager) {
      toaster.create({ title: "請選擇負責人或勾選各自準備", type: "error" });
      return;
    }

    if (!formData.itemName.trim()) {
      toaster.create({ title: "請輸入物品名稱", type: "error" });
      return;
    }
    if (!formData.num || Number(formData.num) <= 0) {
      toaster.create({ title: "請輸入有效的數量", type: "error" });
      return;
    }
    
    if (!formData.category) {
      toaster.create({ title: "請選擇一個分類", type: "error" });
      return;
    }
     const docData = {
      itemName: formData.itemName,
      num: Number(formData.num),
      manager: tempManager , 
      assignees: tempAssignments, // 陣列
      category: formData.category,      
      note: formData.note,
      createdAt: serverTimestamp(), 
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

        {/* 負責人選擇 */}
        <SelectManagerBlock manager={tempManager} 
         setManager={setTempManager}
         assignees={tempAssignments}
         setAssignees={setTempAssignments}
         userCollection={userCollection} />

        {/* 分類標籤 */}
        <CategoryBlock formData={formData} setFormData={setFormData} />

        <Stack gap={1}>
          <Text color="#4A3728" fontWeight="bold">備註：</Text>
          <Textarea 
            placeholder="請輸入備註資訊..."
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            bg="#FFF9ED"
            border="2px solid #5B6D5B"
            borderRadius="15px"
            color="black"
            _focus={{ borderColor: "teal.500" }}
            resize="none" // 防止使用者隨意拉伸破壞排版
            rows={3}
          />
        </Stack>

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
