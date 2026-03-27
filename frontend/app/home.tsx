import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import doctorService, { Doctor } from '../services/doctorService';

export default function HomeScreen() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
      loadDoctors();
      loadSpecialties();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUserId(user._id || user.id);
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    }
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Không thể tải danh sách bác sĩ';
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecialties = async () => {
    try {
      const data = await doctorService.getSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.log('Error loading specialties:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await doctorService.getDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setRefreshing(false);
    }
  };

  const filterDoctors = (search: string, specialty: string | null) => {
    let filtered = doctors;

    if (specialty) {
      filtered = filtered.filter((d) => d.specialty === specialty);
    }

    if (search.trim()) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredDoctors(filtered.filter(d => d.userId !== currentUserId && d.userId?._id !== currentUserId));
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    filterDoctors(text, selectedSpecialty);
  };

  const handleSpecialtyFilter = (specialty: string | null) => {
    setSelectedSpecialty(specialty);
    filterDoctors(searchText, specialty);
  };

  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() =>
        router.push({
          pathname: '/booking',
          params: {
            doctorId: item._id,
            doctorName: item.name,
            doctorPrice: item.price.toString(),
            doctorSpecialty: item.specialty,
          },
        })
      }
    >
      <View style={styles.doctorHeader}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          {item.experience > 0 && (
            <Text style={styles.experience}>
              Kinh nghiệm: {item.experience} năm
            </Text>
          )}
        </View>
        {item.rating !== undefined && item.rating > 0 && (
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={16} color="#fbbf24" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>
          {Number(item.price).toLocaleString('vi-VN')} VNĐ
        </Text>
        <TouchableOpacity 
          style={styles.chatBtn}
          onPress={() => {
            const receiverId = item.userId?._id || item.userId;
            router.push({
              pathname: '/chat/[id]',
              params: { id: receiverId, name: item.name }
            });
          }}
        >
          <MaterialIcons name="chat" size={20} color="#fff" />
          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chọn Bác Sĩ</Text>
        <Text style={styles.headerSubtitle}>Tìm bác sĩ phù hợp với bạn</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#94a3b8"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm bác sĩ..."
          placeholderTextColor="#cbd5e1"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {specialties.length > 0 && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              selectedSpecialty === null && styles.filterBtnActive,
            ]}
            onPress={() => handleSpecialtyFilter(null)}
          >
            <Text
              style={[
                styles.filterBtnText,
                selectedSpecialty === null && styles.filterBtnTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          {specialties.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={[
                styles.filterBtn,
                selectedSpecialty === specialty && styles.filterBtnActive,
              ]}
              onPress={() => handleSpecialtyFilter(specialty)}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  selectedSpecialty === specialty && styles.filterBtnTextActive,
                ]}
              >
                {specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {filteredDoctors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="person-off" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>Không tìm thấy bác sĩ</Text>
          <Text style={styles.emptySubtext}>
            Hãy thử thay đổi tiêu chí tìm kiếm
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0f2fe',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e293b',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#fff',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
  },
  filterBtnActive: {
    backgroundColor: '#0ea5e9',
  },
  filterBtnText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
    color: '#94a3b8',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  chatBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
