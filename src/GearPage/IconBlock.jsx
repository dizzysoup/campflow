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
          zIndex={5001}
          onClick={() => setIsIconBlockOpen(false)}
        />

        {/* 底部內容盒 */}
        <Box
          position="fixed"
          bottom={0}
          left="50%"
          transform="translateX(-50%)"
          w="100%"
          maxW="500px"
          bg="#FFF9ED"
          p={6}
          borderTopRadius="30px"
          border="3px solid #5B6D5B"
          borderBottom="none"
          zIndex={5002}
          boxShadow="0 -10px 25px rgba(0,0,0,0.15)"
        >
          <HStack
            // --- 核心滾動修正 ---
            overflowX="auto" 
            whiteSpace="nowrap" // 確保內容不換行
            alignItems="center"
            gap={4}
            py={2}
            px={4}
            minH="120px"
            
            // --- 隔離 Dialog 的拖拽干擾 ---
            onPointerDown={(e) => e.stopPropagation()} 
            onDragStart={(e) => e.stopPropagation()} 
            
            style={{
              touchAction: 'pan-x', // 強制瀏覽器只處理水平觸摸
              WebkitOverflowScrolling: 'touch',
              display: 'flex',
            }}
            
            css={{
              '&::-webkit-scrollbar': { display: 'none' },
              'scrollbarWidth': 'none',
              'msOverflowStyle': 'none',
            }}
          >
            {iconList.map((src, index) => (
              <Box
                key={index}
                flexShrink={0} // 重要：防止圖片被 Flex 壓縮寬度
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: "scale(1.1)" }}
                onClick={(e) => {
                  e.stopPropagation();
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
                  userSelect="none"
                  draggable={false} // 防止原生圖片拖拽行為干擾滾動
                />
              </Box>
            ))}
          </HStack>
        </Box>
      </>
    );
  };
