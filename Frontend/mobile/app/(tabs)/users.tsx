import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import AdminLayout from '@/components/AdminLayout';
import { usersService } from '@/services/usersService';
import { ApiUser } from '@/types/request';

interface User {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string;
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const roles = ['all', 'admin', 'client', 'technician'];
  const roleLabels = {
    all: 'Todos',
    admin: 'Administrador',
    client: 'Cliente',
    technician: 'Técnico'
  };

  useEffect(() => {
    if (selectedRole === 'all') {
      fetchAllUsers();
    } else {
      fetchUsersByRole(selectedRole);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (Array.isArray(users) && users.length > 0) {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.roles.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [search, users]);

  const mapApiUserToUser = (apiUser: ApiUser): User => ({
    id: apiUser.id,
    nationalId: apiUser.id.toString(),
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    roles: apiUser.role,
  });

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const result = await usersService.getAllUsers();
      if (result.success && result.data) {
        const mappedUsers = result.data.map(mapApiUserToUser);
        setUsers(mappedUsers);
      } else {
        setUsers([]);
        Alert.alert('Error', result.message || 'Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
      Alert.alert('Error', 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByRole = async (role: string) => {
    setLoading(true);
    try {
      const result = await usersService.getUsersByRole(role);
      if (result.success && result.data) {
        const mappedUsers = result.data.map(mapApiUserToUser);
        setUsers(mappedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(`Error fetching users by role ${role}:`, error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedRole === 'all') {
      await fetchAllUsers();
    } else {
      await fetchUsersByRole(selectedRole);
    }
    setRefreshing(false);
  };

  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const openRoleChangeModal = (user: User) => {
    setSelectedUser(user);
    setRoleModalVisible(true);
  };

  const handleRoleChange = async (newRole: string) => {
    if (!selectedUser) return;

    try {
      const result = await usersService.updateUserRole(selectedUser.id, newRole);
      if (result.success) {
        Alert.alert('Éxito', 'Rol actualizado correctamente');
        setRoleModalVisible(false);
        onRefresh();
      } else {
        Alert.alert('Error', result.message || 'Error al actualizar el rol');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', 'Error al actualizar el rol');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await usersService.deleteUser(userId);
              if (result.success) {
                Alert.alert('Éxito', 'Usuario eliminado correctamente');
                setModalVisible(false);
                onRefresh();
              } else {
                Alert.alert('Error', result.message || 'Error al eliminar usuario');
              }
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Error al eliminar usuario');
            }
          }
        }
      ]
    );
  };

  const renderRoleTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
      <View style={styles.tabContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.tab,
              selectedRole === role && styles.activeTab
            ]}
            onPress={() => setSelectedRole(role)}
          >
            <Text style={[
              styles.tabText,
              selectedRole === role && styles.activeTabText
            ]}>
              {roleLabels[role as keyof typeof roleLabels]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderUserCard = (user: User) => (
    <TouchableOpacity
      key={user.id}
      style={styles.userCard}
      onPress={() => openUserDetail(user)}
    >
      <View style={styles.userHeader}>
        <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.userRole}>{user.roles}</Text>
      </View>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.userId}>ID: {user.nationalId}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <AdminLayout title="Usuarios">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Usuarios">
      <View style={styles.container}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, email o rol..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Role Tabs */}
        {renderRoleTabs()}

        {/* Users List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map(renderUserCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay usuarios con el rol seleccionado
              </Text>
            </View>
          )}
        </ScrollView>

        {/* User Detail Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedUser && (
                <>
                  <Text style={styles.modalTitle}>Detalle de Usuario</Text>
                  
                  <Text style={styles.modalLabel}>Nombre:</Text>
                  <Text style={styles.modalValue}>{selectedUser.firstName} {selectedUser.lastName}</Text>
                  
                  <Text style={styles.modalLabel}>Email:</Text>
                  <Text style={styles.modalValue}>{selectedUser.email}</Text>
                  
                  <Text style={styles.modalLabel}>Rol:</Text>
                  <Text style={styles.modalValue}>{selectedUser.roles}</Text>
                  
                  <Text style={styles.modalLabel}>ID:</Text>
                  <Text style={styles.modalValue}>{selectedUser.nationalId}</Text>
                  
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.changeRoleButton}
                      onPress={() => {
                        setModalVisible(false);
                        openRoleChangeModal(selectedUser);
                      }}
                    >
                      <Text style={styles.actionButtonText}>Cambiar Rol</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteUser(selectedUser.id)}
                    >
                      <Text style={styles.actionButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Role Change Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={roleModalVisible}
          onRequestClose={() => setRoleModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cambiar Rol</Text>
              <Text style={styles.modalSubtitle}>
                Usuario: {selectedUser?.firstName} {selectedUser?.lastName}
              </Text>
              
              {roles.filter(role => role !== 'all').map((role) => (
                <TouchableOpacity
                  key={role}
                  style={styles.roleOption}
                  onPress={() => handleRoleChange(role)}
                >
                  <Text style={styles.roleOptionText}>
                    {roleLabels[role as keyof typeof roleLabels]}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setRoleModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  tabScrollView: {
    maxHeight: 50,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 6,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  userRole: {
    fontSize: 12,
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  changeRoleButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  roleOption: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});