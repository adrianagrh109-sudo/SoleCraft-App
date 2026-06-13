// src/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Select,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

const statusColorScheme = {
  pending: 'yellow',
  'In Production': 'blue',
  Done: 'green',
};

export default function AdminDashboard() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchPesanan();
  }, []);

  async function fetchPesanan() {
    setLoading(true);
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Gagal memuat data',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setPesanan([]);
    } else {
      setPesanan(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id, statusBaru) {
    const { error } = await supabase
      .from('designs')
      .update({ status_pesanan: statusBaru })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Gagal update status',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      setPesanan((prev) => prev.map((p) => (p.id === id ? { ...p, status_pesanan: statusBaru } : p)));
      toast({
        title: 'Status diperbarui',
        description: `Pesanan berhasil diubah menjadi ${statusBaru}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" mb={2}>
              SoleCraft Admin
            </Heading>
            <Text color="gray.600">Kelola status pesanan, tinjau detail pelanggan, dan update progress produksi.</Text>
          </Box>

          <Button
            leftIcon={<Icon as={RepeatIcon} />}
            colorScheme="blackAlpha"
            variant="solid"
            onClick={fetchPesanan}
            minW="150px"
          >
            Refresh Data
          </Button>
        </Flex>

        <Box bg="white" rounded="2xl" shadow="sm" borderWidth={1} borderColor="gray.200" overflowX="auto">
          {loading ? (
            <Center py={16}>
              <Stack direction="row" align="center" spacing={3}>
                <Spinner size="lg" color="black" />
                <Text fontSize="md" color="gray.600">
                  Memuat data pesanan...
                </Text>
              </Stack>
            </Center>
          ) : pesanan.length === 0 ? (
            <Center py={16}>
              <Stack spacing={2} align="center">
                <Heading size="md">Belum ada pesanan masuk</Heading>
                <Text color="gray.500">Coba klik refresh jika ada pesanan baru atau pastikan tabel Supabase sudah berisi data.</Text>
              </Stack>
            </Center>
          ) : (
            <Table variant="simple" size="md">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Customer</Th>
                  <Th>Kontak</Th>
                  <Th>Status Saat Ini</Th>
                  <Th textAlign="center">Ubah Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pesanan.map((p) => (
                  <Tr key={p.id} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="semibold">{p.Customer_Name || '-'}</Td>
                    <Td>
                      <Text>{p.customer_email || '-'}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {p.customer_phone || 'Tidak ada nomor'}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={statusColorScheme[p.status_pesanan || 'pending']} variant="subtle" px={3} py={1} fontSize="xs" rounded="full">
                        {p.status_pesanan || 'pending'}
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <Select
                        maxW="220px"
                        value={p.status_pesanan || 'pending'}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                        bg="gray.50"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="In Production">🛠️ In Production</option>
                        <option value="Done">🎉 Done</option>
                      </Select>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Container>
    </Box>
  );
}

