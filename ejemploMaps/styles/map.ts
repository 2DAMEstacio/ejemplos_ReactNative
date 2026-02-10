import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120',
    paddingHorizontal: 20,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    color: '#f8fafc',
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#94a3b8',
  },
  signOutButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    minWidth: 160,
  },
  signOutText: {
    color: '#e2e8f0',
    fontWeight: '600',
    textAlign: 'center',
  },
  searchCard: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  label: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0b1220',
    color: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  searchText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  errorText: {
    marginTop: 10,
    color: '#fca5a5',
  },
  resultText: {
    marginTop: 10,
    color: '#cbd5f5',
  },
  mapWrap: {
    flex: 1,
    marginTop: 16,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
    minHeight: 220,
  },
  footer: {
    marginTop: 12,
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});
