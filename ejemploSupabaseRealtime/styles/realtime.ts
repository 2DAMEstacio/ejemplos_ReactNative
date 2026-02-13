import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 10,
    gap: 6,
  },
  title: {
    fontSize: 24,
    color: '#f8fafc',
    fontWeight: '700',
  },
  subtitle: {
    color: '#94a3b8',
  },
  statusText: {
    color: '#93c5fd',
    fontSize: 12,
  },
  card: {
    marginTop: 14,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 10,
  },
  label: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0b1220',
    color: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  questionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  buttonSecondaryText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 8,
    color: '#fca5a5',
  },
  listCard: {
    flex: 1,
    marginTop: 14,
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
  },
  listTitle: {
    color: '#e5e7eb',
    fontWeight: '700',
    marginBottom: 10,
  },
  item: {
    borderWidth: 1,
    borderColor: '#273244',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#0f172a',
    gap: 6,
  },
  itemOwn: {
    borderColor: '#1d4ed8',
  },
  itemAnswered: {
    borderColor: '#0f766e',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicBadge: {
    color: '#e0e7ff',
    backgroundColor: '#312e81',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: 12,
    overflow: 'hidden',
  },
  itemTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 15,
  },
  itemMeta: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  itemActions: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  smallButtonSecondary: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  smallButtonSecondaryText: {
    color: '#e2e8f0',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    marginTop: 10,
    marginBottom: 12,
  },
  signOutButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
});
