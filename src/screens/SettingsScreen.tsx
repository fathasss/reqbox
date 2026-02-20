import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/theme';
import useEnvironmentStore from '../store/useEnvironmentStore';

export default function SettingsScreen() {
    const { environments, selectedEnvironmentId, addEnvironment, removeEnvironment, setSelectedEnvironment } = useEnvironmentStore();
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');

    const handleAdd = () => {
        if (!newName || !newUrl) {
            Alert.alert('Error', 'Please enter both name and URL');
            return;
        }
        addEnvironment({ name: newName, baseUrl: newUrl });
        setNewName('');
        setNewUrl('');
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.item, selectedEnvironmentId === item.id && styles.selectedItem]}
            onPress={() => setSelectedEnvironment(item.id)}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUrl}>{item.baseUrl}</Text>
            </View>
            <View style={styles.itemActions}>
                {selectedEnvironmentId === item.id && <Feather name="check-circle" size={20} color={COLORS.primary} />}
                <TouchableOpacity onPress={() => removeEnvironment(item.id)}>
                    <Feather name="trash-2" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Environments</Text>

            <View style={styles.addForm}>
                <TextInput
                    style={styles.input}
                    placeholder="Env Name (e.g. Local)"
                    placeholderTextColor={COLORS.textSecondary}
                    value={newName}
                    onChangeText={setNewName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Base URL (https://...)"
                    placeholderTextColor={COLORS.textSecondary}
                    value={newUrl}
                    onChangeText={setNewUrl}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Feather name="plus" size={20} color='white' />
                    <Text style={styles.addButtonText}>Add Environment</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={environments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No environments added</Text>}
            />

            <View style={styles.infoSection}>
                <Text style={styles.infoText}>Selected Environment affects URL auto-complete in Request screen.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
    },
    addForm: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: 12,
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    input: {
        backgroundColor: COLORS.background,
        color: COLORS.text,
        padding: SPACING.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: SPACING.sm,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    list: {
        gap: SPACING.md,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    selectedItem: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    itemName: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemUrl: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    itemActions: {
        flexDirection: 'row',
        gap: SPACING.md,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    },
    infoSection: {
        marginTop: SPACING.lg,
        padding: SPACING.md,
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderRadius: 8,
    },
    infoText: {
        color: COLORS.primary,
        fontSize: 12,
        textAlign: 'center',
    }
});
