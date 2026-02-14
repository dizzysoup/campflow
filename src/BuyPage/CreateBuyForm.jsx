import React, { useState, useEffect, useMemo } from "react"; // 加入 useMemo
import { 
  Stack, Container, VStack, Text,
  Box, HStack, Input, Textarea, Button, SimpleGrid
} from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toaster } from "../components/ui/toaster";
import { SelectManagerBlock } from "./SelectManagerBlock";

export const CreateBuyForm = ({ onClose, userCollection }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    num: "",    
    price: "", // 新增單價欄位
    category: "一般", // 建議給予預設值或從 props 傳入
    note: "",
    manager: "",
    assignees: []
  }); 

  const [tempManager, setTempManager] = useState("");
  const [tempAssignments, setTempAssignments] = useState([]);

  // 自動計算總價 (使用 useMemo 優化效能)
  const totalPrice = useMemo(() => {
    const n = Number(formData.num) || 0;
    const p = Number(formData.price) || 0;
    return n * p;
  }, [formData.num, formData.price]);

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
      toaster.create({ title: "請選擇負責人", type: "error" });
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

    const docData = {
      itemName: formData.itemName,
      num: Number(formData.num),
      price: Number(formData.price) || 0, // 儲存單價
      totalPrice: totalPrice, // 儲存總價
      manager: tempManager, 
      assignees: tempAssignments,
      category: formData.category,      
      note: formData.note,
      createdAt: serverTimestamp(), 
    };
    
    try {
      await addDoc(collection(db, "buy"), docData);
      setFormData({ itemName: "", num: "", price: "", manager: "", category: "一般", note: "" });
      toaster.create({
        title: "新增成功",
        description: `已新增物品：${formData.itemName}，總計 $${totalPrice}`,
        type: "success",
      });
      onClose();
    } catch (error) {
      toaster.create({ title: "新增失敗", type: "error" });
    }
  };

  return (
    <Box bg="#86A686" p={6} minH="100vh">
      <VStack align="stretch" maxW="500px" mx="auto" gap={4}>
        {/* 標題欄位 */}
        <Stack gap={1}>
          <Text color="#4A3728" fontWeight="bold">物品名稱</Text>
          <Input
            placeholder="例如：飲料"
            bg="#FFF9ED"
            border="2px solid #5B6D5B"
            color="black"
            borderRadius="15px"
            fontSize="xl"
            value={formData.itemName}
            onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
          />
        </Stack>

        {/* 數量與單價並排 */}
        <SimpleGrid columns={2} gap={4}>
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
              value={formData.num}
              onChange={(e) => setFormData(prev => ({ ...prev, num: e.target.value }))}
            />
          </Stack>
          <Stack gap={1}>
            <Text color="#4A3728" fontWeight="bold">單價 ($)</Text>
            <Input 
              type="number"
              placeholder="0" 
              bg="#FFF9ED" 
              border="2px solid #5B6D5B"
              borderRadius="15px"
              fontSize="xl"
              fontWeight="bold"
              color="#4A3728"
              h="50px"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            />
          </Stack>
        </SimpleGrid>

        {/* 顯示總價區塊 */}
        <Box 
          bg="#5B6D5B" 
          p={3} 
          borderRadius="15px" 
          textAlign="right"
          boxShadow="inner"
        >
          <HStack justify="flex-end" gap={2}>
            <Text color="#FFF9ED" fontSize="sm">小計：</Text>
            <Text color="#FFF9ED" fontSize="2xl" fontWeight="black">
              ${totalPrice.toLocaleString()}
            </Text>
          </HStack>
        </Box>

        {/* 負責人選擇 */}
        <SelectManagerBlock 
          manager={tempManager} 
          setManager={setTempManager}
          assignees={tempAssignments}
          setAssignees={setTempAssignments}
          userCollection={userCollection} 
        />
       
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
            resize="none"
            rows={2}
          />
        </Stack>

        {/* 新增按鈕 */}
        <Button 
          bg="#958de3" 
          color="white" 
          h="55px"
          fontSize="lg"
          fontWeight="bold"
          borderRadius="15px"
          borderBottom="4px solid #6A62B0"
          _hover={{ bg: '#8379D1', transform: 'translateY(1px)', borderBottomWidth: '2px' }}
          _active={{ transform: 'translateY(3px)', borderBottomWidth: '0px' }}
          mt={2}
          onClick={handleAdd}
        >
          確認新增
        </Button>
      </VStack>
    </Box>
  );
};