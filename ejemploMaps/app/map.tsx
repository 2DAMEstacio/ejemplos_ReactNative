import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AddressMap from '@/components/address-map';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMapScreen } from '@/hooks/use-map-screen';
import { styles } from '@/styles/map';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const {
    address,
    setAddress,
    loading,
    error,
    resultLabel,
    region,
    setRegion,
    marker,
    handleSearch,
    signOut,
    mapRef,
  } = useMapScreen();

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: 10, paddingBottom: insets.bottom + 12 }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Buscar dirección</Text>
        <Text style={styles.subtitle}>Introduce una dirección y te la muestro en el mapa.</Text>
      </View>

      <View style={styles.searchCard}>
        <Text style={styles.label}>Dirección</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Ej: Plaza Mayor, Benigánim"
            placeholderTextColor="#9aa3af"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.searchText}>Buscar</Text>}
          </TouchableOpacity>
        </View>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {!!resultLabel && <Text style={styles.resultText}>{resultLabel}</Text>}
      </View>

      <View style={styles.mapWrap}>
        <AddressMap
          mapRef={mapRef}
          region={region}
          marker={marker}
          resultLabel={resultLabel}
          onRegionChange={setRegion}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
