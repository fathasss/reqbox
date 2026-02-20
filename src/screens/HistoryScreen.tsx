import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ListRenderItem
} from 'react-native';
import { COLORS, SPACING } from '../theme/theme';
import useHistoryStore from '../store/useHistoryStore';
import { Feather } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

/* -------------------- TYPES -------------------- */
export type HistoryItem = {
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
    url: string;
    statusCode: number;
    ok: boolean;
    duration: number;
    timestamp: number;
};

type RootTabParamList = {
    Request: { loadRequest?: { method: string; url: string; headers?: Record<string, string>; body?: string } };
    History: undefined;
    Settings: undefined;
};

type HistoryScreenNavigationProp =
    BottomTabNavigationProp<RootTabParamList, 'History'>;

/* -------------------- COMPONENT -------------------- */

export default function HistoryScreen({ navigation }: { navigation: HistoryScreenNavigationProp }) {
    const history = useHistoryStore((state) => state.history);
    const clearHistory = useHistoryStore((state) => state.clearHistory);
    const deleteHistoryItem = useHistoryStore((state) => state.deleteHistoryItem);

    const renderItem: ListRenderItem<HistoryItem> = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                // In a real app, we'd pass this back to RequestScreen
                // For now, let's just log it or navigate
                navigation.navigate('Request', { loadRequest: item });
            }}
        >
            <View style={styles.itemHeader}>
                <View style={[styles.methodBadge, { backgroundColor: getMethodColor(item.method) }]}>
                    <Text style={styles.methodText}>{item.method}</Text>
                </View>
                <View style={styles.statusInfo}>
                    <View style={[styles.dot, { backgroundColor: item.ok ? COLORS.success : COLORS.error }]} />
                    <Text style={styles.statusCode}>{item.statusCode}</Text>
                </View>
            </View>

            <Text style={styles.url} numberOfLines={1}>{item.url}</Text>

            <View style={styles.footer}>
                <View style={styles.timeInfo}>
                    <Feather name="clock" size={12} color={COLORS.textSecondary} />
                    <Text style={styles.timeText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                    <Text style={styles.durationText}>{item.duration}ms</Text>
                </View>
                <TouchableOpacity onPress={() => deleteHistoryItem(item.id)}>
                    <Feather name="trash-2" size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const getMethodColor = (method: any) => {
        switch (method) {
            case 'GET': return '#32D74B';
            case 'POST': return '#FFD60A';
            case 'PUT': return '#007AFF';
            case 'DELETE': return '#FF453A';
            default: return COLORS.textSecondary;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.countText}>{history.length} Requests</Text>
                <TouchableOpacity onPress={clearHistory}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No history yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    countText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    clearText: {
        color: COLORS.error,
        fontSize: 14,
        fontWeight: 'bold',
    },
    list: {
        padding: SPACING.md,
    },
    item: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    methodBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    methodText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    },
    statusInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusCode: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '600',
    },
    url: {
        color: COLORS.text,
        fontSize: 14,
        marginBottom: SPACING.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeText: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    durationText: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    }
});
