import React, { useState, useEffect } from "react";
import { 
  Stack, Accordion, Container, VStack, Text ,Field, SelectRoot ,
  createListCollection , SelectTrigger ,
  SelectItem, SelectContent ,
  SelectValueText,Portal, Flex,Spacer,
  Box,  
  HStack,  
  Input,Select,
  Checkbox,Image,
  Button, Dialog
} from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { FaTag, FaCamera } from 'react-icons/fa';
import "./RentalItemCard.css"



// 新增項目UI
export const CreateGearForm = ({onClose}) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    num: "",
    manager: "",
    iconpath: ""
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
        const placeholderOption = { label: "從缺", value: "從缺" };
        setUsers([placeholderOption , ...userList]);     
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
    <HStack 
      // 1. 核心滾動設定
      overflowX="auto" 
      overflowY="hidden" // 禁用 Y 軸防止斜滑動產生的衝突
      whiteSpace="nowrap" // 強制不換行
      gap={4} 
      py={2} 
      px={4} // 增加左右 padding 滾動到底部才不會太擠
      
      // 2. 解決事件衝突
      onPointerDown={(e) => e.stopPropagation()} 
      style={{ 
        touchAction: 'pan-x', // 只允許水平觸摸行為
        WebkitOverflowScrolling: 'touch' // 優化 iOS 滾動流暢度
      }}
      
      // 3. 隱藏滾動條 (選填，讓視覺更乾淨)
      css={{
        '&::-webkit-scrollbar': { display: 'none' },
        'msOverflowStyle': 'none',
        'scrollbarWidth': 'none',
      }}
    >
      {iconList.map((src, index) => (
        <Box
          key={index}
          flexShrink={0} // 絕對不能縮小，否則寬度會崩潰
          cursor="pointer"
          transition="all 0.2s" 
          _hover={{ transform: "scale(1.05)" }} // 手機端建議縮小放大幅度
          onClick={() => {
            setFormData(prev => ({ ...prev, iconpath: src })); 
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
            pointerEvents="none" // 避免圖片本身攔截了滑動手勢
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
        num: Number(formData.num),
        manager: formData.manager, //負責人
        iconpath: formData.iconpath, //圖片路徑
        createdAt: serverTimestamp() 
      }
      console.log(docData);
      addDoc(collection(db, "gear"), docData); 
      setFormData({ itemName: "", num: "", manager: "", iconpath: "" });
      onClose();
    };

    return (
      <Box bg="#86A686" p={6} minH="100vh">
        <VStack  align="stretch" maxW="500px" mx="auto">
          
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
                 onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                _placeholder={{ color: '#A0AEC0' }}
              />
            
              <Box 
                  as="button" 
                  p={2} 
                  bg="#FFF9ED"                   
                  border="2px solid #5B6D5B" 
                  borderColor={formData.iconpath ? "#8B0000" : "#5B6D5B"}
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
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Stack> 
          </HStack>

          {/* 新增按鈕 */}
          <Button 
            bg="#958de3" 
            color="black" 
            h="50px"
            borderRadius="15px"
            borderBottom="4px solid #5B6D5B"
            _hover={{ bg: '#7A8F7A' }}
            mt={4}
            onClick={handleAdd}
          >
            新增
          </Button>
        </VStack>
      </Box>
    );
};
