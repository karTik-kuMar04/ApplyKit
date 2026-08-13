import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useColors } from '@/lib/theme';
import { radius, shadows, spacing, typography } from '@/lib/theme/tokens';
import { IconButton } from './IconButton';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  const colors = useColors();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable
          style={[styles.content, { backgroundColor: colors.surface }, shadows.md]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <IconButton
              icon={<X size={20} color={colors.textSecondary} />}
              onPress={onClose}
              accessibilityLabel="Close"
            />
          </View>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radius.xl,
    padding: spacing['2xl'],
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.subheading,
    flex: 1,
  },
});
