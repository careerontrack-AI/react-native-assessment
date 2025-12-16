import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { goalService } from '../services/api';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateGoalProps {
  visible: boolean;
  onClose: () => void;
  onCreated: (goal: Goal) => void;
}

export default function CreateGoalModal({
  visible,
  onClose,
  onCreated,
}: CreateGoalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTitleError('');
  };

  const validate = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError('Title is required');
      return false;
    }

    if (trimmedTitle.length < 3) {
      setTitleError('Title must be at least 3 characters');
      return false;
    }

    setTitleError('');
    return true;
  };

  const handleClose = () => {
    if (creating) return;
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    if (creating) return;

    if (!validate()) {
      return;
    }

    try {
      setCreating(true);
      const created = await goalService.createGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        status: 'not_started',
      });

      const newGoal = (created && created.goal) || created;

      if (!newGoal) {
        throw new Error('Invalid response from server');
      }

      onCreated(newGoal);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating goal:', error);
      Alert.alert('Error', 'Failed to create goal');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalContainer,
            Platform.OS === 'ios' && { marginBottom: 40 },
          ]}
        >
          <Text style={styles.modalTitle}>Create Goal</Text>

          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={[
              styles.input,
              titleError ? styles.inputErrorBorder : undefined,
            ]}
            placeholder="e.g. Get a promotion to Senior Engineer"
            placeholderTextColor="#999"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError) setTitleError('');
            }}
            editable={!creating}
            returnKeyType="next"
          />
          {titleError ? (
            <Text style={styles.errorText}>{titleError}</Text>
          ) : null}

          <Text style={styles.inputLabel}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add more details about this goal"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            editable={!creating}
            multiline
            numberOfLines={4}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={handleClose}
              disabled={creating}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalPrimaryButton,
                creating && styles.modalPrimaryButtonDisabled,
              ]}
              onPress={handleCreate}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalPrimaryText}>Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputErrorBorder: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  modalPrimaryButton: {
    backgroundColor: '#007AFF',
  },
  modalPrimaryButtonDisabled: {
    opacity: 0.7,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
