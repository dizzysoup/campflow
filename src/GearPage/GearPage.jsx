import { useState, useEffect, useMemo } from "react"; // 加入 useMemo 效能較好
import { Box, Text, Button, Dialog, Flex, Spacer, Image, HStack } from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { CreateGearForm } from "./CreateGearForm";
import { motion } from "framer-motion";
import { EditBox } from "./EditBox";
import { createListCollection } from "@chakra-ui/react"; 
import { GearItemCard } from "./GearItemCard";
// 匯入 Select 相關組件進行篩選 UI 製作
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem, Portal,VStack,SelectPositioner  } from "@chakra-ui/react";

function GearPage(){
  const [rentalsList, setRentalsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [users, setUsers] = useState([]);
  
  // 新增：紀錄篩選的人員 (預設為 "全部")
  const [filterUser, setFilterUser] = useState("全部");

  const userCollection = createListCollection({
    items: users,
  });

  // 1. 取得資料邏輯 (保持不變)
  useEffect(() => {
    const fetchRentalsList = async () => {
      const querySnapshot = await getDocs(collection(db, "gear"));
      const rentalsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,               
          itemName: data.itemName,
          manager: data.manager,
          iconpath : data.iconpath,
          category: data.category,        
          num: data.num ,
          note : data.note,
          assignees: data.assignees || []
        };
      });
      setRentalsList(rentalsData);     
    };
    fetchRentalsList();
  }, [open, editingItem]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({
        label: doc.data().uname,
        value: doc.data().uname,
      }));
      // 篩選清單需要一個「全部」選項，「從缺」也可以保留
      setUsers([
        { label: "全部顯示", value: "全部" },
        { label: "從缺", value: "從缺" },
        ...userList
      ]);        
    };
    fetchUsers();
  }, []);

  // 2. 核心邏輯：根據 filterUser 篩選資料
  const filteredList = useMemo(() => {
    if (filterUser === "全部") return rentalsList;

    return rentalsList.filter(item => {
      // 情況 A：如果是「各自準備」，且我們不是在搜特定人名，通常不顯示在特定人名下
      // 但如果你希望每個人名下都看到「各自準備」，可以調整邏輯
      if (item.manager === "各自準備") return false; 

      // 情況 B：檢查 assignees 陣列中是否包含該使用者
      const isAssigned = item.assignees.some(a => a.user === filterUser);
      
      // 情況 C：檢查舊有的單一 manager 欄位
      const isManager = item.manager === filterUser;

      return isAssigned || isManager;
    });
  }, [rentalsList, filterUser]);

  return (
    <Box>
      <HStack gap={3} align="center" justify="space-between" mx="5%" mt="2%">
        <Box 
              position="relative" 
              px={4} 
              borderRadius="lg" 
              boxShadow="4px 4px 0px #86A686" // 綠色立體陰影
              border="2px solid #FFF9ED"
              bg="#f0b236"
            >
              <Text 
                color="black"   // 米白色文字
                                
                fontSize="md"
                letterSpacing="wider"
              >
                要攜帶的東西
              </Text>
        </Box>

        {/* 篩選 UI 區塊 */}
        <Box>
          <HStack gap={2}>
                <Text color="#4A3728" fontWeight="bold" fontSize="sm" whiteSpace="nowrap">篩選：</Text>
                <SelectRoot 
                  collection={userCollection} 
                  size="sm"
                  value={[filterUser]}
                  onValueChange={(e) => setFilterUser(e.value[0])}
                  width="130px"
                >
                  <SelectTrigger bg="white" borderRadius="10px" border="1px solid #86A686">
                    <SelectValueText placeholder="全部顯示" />
                  </SelectTrigger>
                  
                  {/* 修正 Portal 與 Positioner 的層級 */}
                  <Portal>
                    <SelectPositioner zIndex={9999}>
                      <SelectContent bg="white" boxShadow="md" borderRadius="md">
                        {userCollection.items.map((user) => (
                          <SelectItem 
                            item={user} 
                            key={user.value} 
                            cursor="pointer"
                            _hover={{ bg: "gray.100" }}
                            color="black"
                          >
                            {user.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectPositioner>
                  </Portal>
                </SelectRoot>
          </HStack>

          {/* 篩選結果提示移至此處，避免擠壓 HStack */}
           {filterUser !== "全部" && (
            <Text fontSize="xs" color="black" mb={-1}>
                      目前顯示：{filterUser} 的清單 (共 {filteredList.length} 項)
            </Text>
          )}
         </Box>
      </HStack> 
              
      <Box 
        ml="5%" mr="5%" mt="2%" mb="25%" 
        bg="white" borderRadius="15px" p="2"
        divideY="2px"
        boxShadow="sm"
      >
        {/* 使用 filteredList 而不是 rentalsList */}
        {filteredList.length > 0 ? (
          filteredList.map(item => (
            <GearItemCard 
              key={item.id} 
              item={item} 
              onEdit={(selectedItem) => setEditingItem(selectedItem)} 
            />
          ))
        ) : (
          <Box py={10} textAlign="center">
            <Text color="gray.400">目前沒有 {filterUser} 的相關物品</Text>
          </Box>
        )}

        {editingItem && (
          <EditBox 
            item={editingItem} 
            onClose={() => setEditingItem(null)} 
            userCollection={userCollection}
            onSave={ async (newData ) => {
              try {
                const gearRef = doc(db, "gear", newData.id); 
                await updateDoc(gearRef, {
                  num: Number(newData.num),
                  manager: newData.manager,
                  category: newData.category.category ?? newData.category ?? "", 
                  note: newData.note, 
                  assignees: newData.assignees || [] 
                });
                setEditingItem(null);
              } catch (error) {
                console.error("更新失敗：", error);
              }
            }}
          />
        )}
      </Box>

      {/* 新增按鈕與 Dialog 保持不變 ... */}
      <Box position="fixed" bottom="40px" left="50%" transform="translateX(-50%)" zIndex={10}>
        <Button onClick={() => setOpen(true)} bg="#958de3" color="black" borderRadius="20px" borderBottom="4px solid #5B6D5B" px={8}>
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
                <CreateGearForm onClose={() => setOpen(false)} userCollection={userCollection} />
              </Dialog.Body>
            </Dialog.Content>
      </Dialog.Root>  
    </Box>
  );
}

export default GearPage;