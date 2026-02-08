import React, { useState, useEffect } from "react";
import { 
  Stack, Accordion, Container, VStack, Text ,Field, SelectRoot ,
  createListCollection , SelectTrigger ,
  SelectItem, SelectContent ,
  SelectValueText,Portal, Flex,Spacer,
  Box,  
  HStack,  
  Input,
  Checkbox,
  Button, Dialog
} from "@chakra-ui/react";
import { db } from "./firebase"; 
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { FaTag, FaCamera } from 'react-icons/fa';

function RentCreateButton2() {
  const [users, setUsers] = useState([]);
  
  const userChoices = createListCollection({ items: users });
  const splitUser = createListCollection({items: [{ label: "平均分擔", value: "all" }, ...users],});

  // 1. 建立狀態來儲存輸入值
  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    manager: "",
    splitMethod: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({
        label: doc.data().uname,
        value: doc.data().uname, 
      }));
      const defaultOption = { label: "平均分擔", value: "all" };
      setUsers(userList);     
    };
    fetchUsers();


  }, []);

  // 2. 處理輸入變動
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. 按下按鈕的處理函式
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
    <Container maxW="container.md" py={1}>
      <VStack align="stretch">
        <Box textAlign="center" py={2}>
          <Text color="gray.600">管理您的露營設備租借狀態</Text>
        </Box>

        <Accordion.Root collapsible defaultValue={["info"]} variant="enclosed">
          <Accordion.Item value="info">
            <Accordion.ItemTrigger cursor="pointer" _hover={{ bg: "green.800" }} p={4}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                ✨ 新增租借項目
              </Box>
            </Accordion.ItemTrigger>

            <Accordion.ItemContent bg="green.800" >
              <Box p={6} borderTop="1px solid" borderColor="black">
                <Stack gap="6">
                  {/* 第一列：項目與價格 */}
                  <HStack gap="4" align="flex-start">
                    <Field.Root flex="1">
                      <Field.Label fontWeight="bold" color="white">租借項目</Field.Label>
                      <Input 
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        placeholder="ex：帳篷" 
                        variant="outline" 
                        color="white"
                      />
                    </Field.Root>

                    <Field.Root flex="1">
                      <Field.Label fontWeight="bold" color="white">租借價格</Field.Label>
                      <Input 
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="金額" 
                        type="number" 
                        color="white"
                      />
                    </Field.Root>
                  </HStack>

                  {/* 第二列：負責人與分錢 */}
                  <HStack gap="4" align="flex-start">
                    <Field.Root flex="1">
                      <Field.Label fontWeight="bold" color="white">付款人</Field.Label>
                      <SelectRoot 
                        collection={userChoices} 
                        onValueChange={(e) => setFormData(prev => ({ ...prev, manager: e.value[0] }))}                        
                      >
                        <SelectTrigger color="white">
                          <SelectValueText placeholder={formData.manager || "選擇人員"} />
                        </SelectTrigger>                        
                            <SelectContent >
                            {userChoices.items.map((u) => (
                                <SelectItem item={u} key={u.value}>{u.label}</SelectItem>
                            ))}
                            </SelectContent>                       
                      </SelectRoot>
                    </Field.Root>

                    <Field.Root flex="1">
                      <Field.Label fontWeight="bold" color="white">分擔方式</Field.Label>
                      <SelectRoot 
                        collection={splitUser} 
                        onValueChange={(e) => setFormData(prev => ({ ...prev, manager: e.value[0] }))}                        
                      >
                        <SelectTrigger color="white">
                          <SelectValueText placeholder={formData.manager || "選擇人員"} />
                        </SelectTrigger>                        
                            <SelectContent >
                            {splitUser.items.map((u) => (
                                <SelectItem item={u} key={u.value}>{u.label}</SelectItem>
                            ))}
                            </SelectContent>                       
                      </SelectRoot>
                    </Field.Root>
                  </HStack>

                  <Button 
                    size="md" 
                    alignSelf="flex-end" 
                    px={10}
                    bg="blue.500" 
                    color="white" // 改為白色較易閱讀
                    _hover={{ bg: "blue.600" }}
                    onClick={handleAdd}
                  >
                    新增紀錄
                  </Button>
                </Stack>
              </Box>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>

        <Box height="1px" bg="gray.200" my={4} />
      </VStack>
    </Container>
  );
}


const CreateExpenseForm = () => {
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
              borderRadius="15px"
              _placeholder={{ color: '#A0AEC0' }}
            />
            {/* 改用 Box 包裹 Icon 避免按鈕結構問題 */}
            <Box as="button" p={2} bg="#FFF9ED" border="2px solid #5B6D5B" borderRadius="15px">
              <FaTag color="#A67C52" />
            </Box>
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

        {/* 支付者與日期 */}
        <HStack gap={4} align="flex-end">
          <Stack flex={1} gap={1}>
            <Text color="#4A3728" fontWeight="bold">支付者</Text>
            {/* 修正點：使用原生 select 標籤並加上樣式，避免 input void element 錯誤 */}
            <select 
              style={{
                backgroundColor: '#FFF9ED',
                border: '2px solid #5B6D5B',
                borderRadius: '15px',
                padding: '8px',
                height: '45px',
                color: '#4A3728'
              }}
            >
              <option value="me">政廷 (我)</option>
              <option value="friend1">王小王</option>
            </select>
          </Stack>
          
          <Stack flex={1} gap={1}>
            <Text color="#4A3728" fontWeight="bold">何時</Text>
            <Input 
              type="date" 
              bg="#FFF9ED" 
              border="2px solid #5B6D5B"
              borderRadius="15px"
              h="45px"
              defaultValue="2026-02-07"
            />
          </Stack>
        </HStack>

        {/* 分攤區塊 */}
        <Box mt={2}>
          <HStack justify="space-between" mb={3}>
            <HStack>
              {/* 簡單的 HTML checkbox 代替，確保不噴錯 */}
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
              <Text fontWeight="bold" color="#4A3728">分攤</Text>
            </HStack>
            <Text fontSize="sm" color="#4A3728">平均分配 ⇅</Text>
          </HStack>

          <Box bg="#FFF9ED" p={4} borderRadius="15px" border="2px solid #5B6D5B">
            <HStack justify="space-between">
              <Text color="#4A3728" fontWeight="medium">政廷 (我)</Text>
              <Text color="#4A3728" fontWeight="bold">$0.00</Text>
            </HStack>
          </Box>
        </Box>

        {/* 新增按鈕 */}
        <Button 
          bg="#8DA38D" 
          color="white" 
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


// 新增開支
function CreateRentButton({ onClick }) {
  return (
    <Button 
      onClick={onClick}
      bg="#8DA38D" 
      color="white" 
      size="lg"
      borderRadius="20px"
      px={8}
      boxShadow="0 4px 10px rgba(0,0,0,0.2)"
      _hover={{ transform: 'scale(1.05)', bg: '#7A8F7A' }}
    > 
      新增開支 
    </Button>
  );
}

const RentalItemCard = ({ item }) => {
  // 防止 item 為空時出錯
  if (!item) return null;

  return (
    <Flex className="rental-card">
      {/* 左側圖示區 */}
      <div className="rental-icon-box">
        {item.icon || '⛺'}
      </div>

      {/* 中間資訊區 */}
      <div className="rental-content">
        <div className="rental-header">
          <h3 className="rental-title">
            {item.itemName}
          </h3>
          <span className="rental-status-badge">
            租借中
          </span>
        </div>
        
        <div className="rental-details">
          <p className="rental-price">
            NT$ {item.price}
          </p>
          <div className="rental-meta">
            <span className="rental-footer">租借人：{item.manager}</span>           
          </div>
        </div>
      </div>

      {/* 右側箭頭 */}
      <Spacer/>
      <div className="rental-arrow-icon"></div>
    </Flex>
  );
};

function Rent(){
  const [rentalsList, setRentalsList] = useState([]);
  const [open, setOpen] = useState(false);

   useEffect(() => {
    const fetchRentalsList = async () => {
      const querySnapshot = await getDocs(collection(db, "rentals"));
      const rentalsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,               
          itemName: data.itemName, // 帳篷
          manager: data.manager, // 負責人
          price: data.price, // 價格
          payee: data.payee, // 分擔方式
          createdAt: data.createdAt  // 如果你有存時間戳記的話
        };
      });
      console.log(rentalsData);
      setRentalsList(rentalsData);     
    };
    fetchRentalsList();

  }, []);

  return (
    <Box>
      <Box w="60%" ml="10%" mt="5%">
        {rentalsList.map(item => (
          <RentalItemCard key={item.id} item={item} />
        ))}
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
          bg="#8DA38D" 
          color="white" 
          borderRadius="20px"
          px={8}
          _hover={{ bg: '#7A8F7A' }}
        >
          新增開支
        </Button>
      </Box>

      <Dialog.Root 
        placement="bottom" 
        open={open} 
        onOpenChange={(e) => setOpen(e.open)}
        motionPreset="slide-in-bottom" // 由下往上滑出特效
      >
        <Dialog.Backdrop /> {/* 這是背景遮罩，點擊會縮回去 */}
        <Dialog.Content 
          bg="#86A686" 
          borderTopRadius="30px" 
          p={0}
          h="90vh" // 設定高度
        >
          <Dialog.Body p={0}>
            <CreateExpenseForm />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
      
    </Box>
  );
}

export default Rent;