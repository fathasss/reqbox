import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { RouteProp } from '@react-navigation/native';
import { COLORS, SPACING } from '../theme/theme';
import { executeRequest } from '../api/RequestEngine';
import useHistoryStore from '../store/useHistoryStore';
import useEnvironmentStore from '../store/useEnvironmentStore';
import { parseCurl } from '../utils/CurlParser';

type RootTabParamList = {
    Request: { loadRequest?: { method: string; url: string; headers?: Record<string, string>; body?: string } };
    History: undefined;
    Settings: undefined;
};

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function RequestScreen({ route }: { route: RouteProp<RootTabParamList, 'Request'> }) {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('');
    const [activeTab, setActiveTab] = useState('Headers');
    const [headers, setHeaders] = useState([{ key: '', value: '', enabled: true }]);
    const [params, setParams] = useState([{ key: '', value: '', enabled: true }]);
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [showMethodPicker, setShowMethodPicker] = useState(false);

    const addToHistory = useHistoryStore((state) => state.addToHistory);
    const { environments, selectedEnvironmentId } = useEnvironmentStore();
    const selectedEnv = environments.find(e => e.id === selectedEnvironmentId);

    // Handle loading from history
    useEffect(() => {
        if (route.params?.loadRequest) {
            const item = route.params.loadRequest;
            setMethod(item.method);
            setUrl(item.url);
            setBody(item.body || '');

            const hdrs = item.headers || {};
            const resHeaders = Object.keys(hdrs).map(k => ({
                key: k,
                value: hdrs[k],
                enabled: true
            }));
            setHeaders(resHeaders.length ? resHeaders : [{ key: '', value: '', enabled: true }]);

            // Clear response when loading new request
            setResponse(null);
        }
    }, [route.params?.loadRequest]);

    const handleSend = async () => {
        if (!url) {
            Alert.alert('Missing URL', 'Please enter a target URL.');
            return;
        }

        setLoading(true);
        setResponse(null);

        const headerObj = headers.reduce((acc, h) => {
            if (h.enabled && h.key) acc[h.key] = h.value;
            return acc;
        }, {} as any);

        const paramObj = params.reduce((acc, p) => {
            if (p.enabled && p.key) acc[p.key] = p.value;
            return acc;
        }, {} as any);

        let finalUrl = url;
        if (!url.startsWith('http') && selectedEnv?.baseUrl) {
            const base = selectedEnv.baseUrl.endsWith('/') ? selectedEnv.baseUrl.slice(0, -1) : selectedEnv.baseUrl;
            const path = url.startsWith('/') ? url : `/${url}`;
            finalUrl = `${base}${path}`;
        }

        const result = await executeRequest({
            url: finalUrl,
            method,
            headers: headerObj,
            params: paramObj,
            body: method !== 'GET' ? body : null,
        });

        setResponse(result);
        setLoading(false);

        addToHistory({
            url,
            method,
            headers: headerObj,
            body,
            statusCode: result.status,
            duration: result.duration,
            ok: result.ok
        });
    };

    const handleCurlImport = async () => {
        try {
            const text = await Clipboard.getStringAsync();
            const parsed = parseCurl(text);
            if (parsed) {
                setMethod(parsed.method);
                setUrl(parsed.url);
                setBody(parsed.body);
                const newHeaders = Object.keys(parsed.headers).map(k => ({
                    key: k,
                    value: parsed.headers[k],
                    enabled: true
                }));
                setHeaders(newHeaders.length ? newHeaders : [{ key: '', value: '', enabled: true }]);
                Alert.alert('Success', 'cURL command imported successfully.');
            } else {
                Alert.alert('Invalid cURL', 'The text in your clipboard is not a valid cURL command.');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to read from clipboard.');
        }
    };

    const formatData = (data: any) => {
        if (typeof data !== 'string') {
            return JSON.stringify(data, null, 2);
        }
        // Simple XML check and "pretty" attempt (minimal)
        if (data.trim().startsWith('<?xml') || data.trim().startsWith('<')) {
            return data.replace(/></g, '>\n<'); // Very basic line break formatting
        }
        return data;
    };

    const renderKeyValueList = (list: any[], setList: (l: any[]) => void) => {
        return (
            <View style={styles.kvContainer}>
                {list.map((item, index) => (
                    <View key={index} style={styles.kvRow}>
                        <TextInput
                            style={[styles.input, styles.kvInput]}
                            placeholder="Key"
                            placeholderTextColor={COLORS.textSecondary}
                            value={item.key}
                            onChangeText={(val) => {
                                const newList = [...list];
                                newList[index].key = val;
                                setList(newList);
                            }}
                        />
                        <TextInput
                            style={[styles.input, styles.kvInput]}
                            placeholder="Value"
                            placeholderTextColor={COLORS.textSecondary}
                            value={item.value}
                            onChangeText={(val) => {
                                const newList = [...list];
                                newList[index].value = val;
                                setList(newList);
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                const newList = list.filter((_, i) => i !== index);
                                setList(newList.length ? newList : [{ key: '', value: '', enabled: true }]);
                            }}
                        >
                            <Feather name="trash-2" size={18} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setList([...list, { key: '', value: '', enabled: true }])}
                >
                    <Feather name="plus" size={18} color={COLORS.primary} />
                    <Text style={styles.addButtonText}>Add Property</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView style={styles.content}>
                {/* Actions Row */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.iconBtn} onPress={handleCurlImport}>
                        <MaterialIcons name="content-paste" size={18} color={COLORS.primary} />
                        <Text style={styles.iconBtnText}>Import cURL</Text>
                    </TouchableOpacity>
                </View>

                {/* Method & URL */}
                <View style={styles.urlSection}>
                    <TouchableOpacity
                        style={styles.methodSelector}
                        onPress={() => setShowMethodPicker(!showMethodPicker)}
                    >
                        <Text style={styles.methodText}>{method}</Text>
                        <Feather name="chevron-down" size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.urlInput}
                        placeholder=" https://api.example.com"
                        placeholderTextColor={COLORS.textSecondary}
                        value={url}
                        onChangeText={setUrl}
                        autoCapitalize="none"
                    />
                </View>

                {showMethodPicker && (
                    <View style={styles.methodPicker}>
                        {METHODS.map((m) => (
                            <TouchableOpacity
                                key={m}
                                style={styles.methodOption}
                                onPress={() => {
                                    setMethod(m);
                                    setShowMethodPicker(false);
                                }}
                            >
                                <Text style={[styles.methodOptionText, method === m && { color: COLORS.primary }]}>{m}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    {['Headers', 'Params', 'Body'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                    {activeTab === 'Headers' && renderKeyValueList(headers, setHeaders)}
                    {activeTab === 'Params' && renderKeyValueList(params, setParams)}
                    {activeTab === 'Body' && (
                        <TextInput
                            style={[styles.input, styles.bodyInput]}
                            multiline
                            placeholder='{"key": "value"}'
                            placeholderTextColor={COLORS.textSecondary}
                            value={body}
                            onChangeText={setBody}
                            spellCheck={false}
                            autoCorrect={false}
                        />
                    )}
                </View>

                {/* Response Section */}
                {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />}

                {response && (
                    <View style={styles.responseContainer}>
                        <View style={styles.responseHeader}>
                            <View style={[styles.statusBadge, { backgroundColor: response.ok ? COLORS.success : COLORS.error }]}>
                                <Text style={styles.statusText}>{response.status}</Text>
                            </View>
                            <Text style={styles.durationText}>{response.duration}ms</Text>
                            <TouchableOpacity onPress={() => Clipboard.setStringAsync(formatData(response.data))}>
                                <Text style={{ color: COLORS.primary, fontSize: 12 }}>Copy</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.responseBodyScroll}>
                            <ScrollView horizontal>
                                <Text style={styles.responseData}>
                                    {formatData(response.data)}
                                </Text>
                            </ScrollView>
                        </ScrollView>
                    </View>
                )}
            </ScrollView>

            {/* Main Action Button */}
            <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
                disabled={loading}
            >
                <Text style={styles.sendButtonText}>Send Request</Text>
                <Ionicons name="send" size={18} color={COLORS.primary} />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.md,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: SPACING.sm,
    },
    iconBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 6,
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderRadius: 6,
    },
    iconBtnText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    urlSection: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
        marginBottom: SPACING.md,
    },
    methodSelector: {
        paddingHorizontal: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
        backgroundColor: 'rgba(255,255,255,0.05)',
        gap: 4,
    },
    methodText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    urlInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: SPACING.md,
        color: COLORS.text,
        fontSize: 14,
    },
    methodPicker: {
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
        padding: SPACING.sm,
        gap: SPACING.sm,
    },
    methodOption: {
        padding: SPACING.sm,
    },
    methodOptionText: {
        color: COLORS.text,
        fontWeight: '600',
        fontSize: 14,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    tab: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        marginRight: SPACING.md,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.primary,
    },
    tabContent: {
        minHeight: 200,
    },
    kvContainer: {
        gap: SPACING.sm,
    },
    kvRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        alignItems: 'center',
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        color: COLORS.text,
        padding: SPACING.sm,
        fontSize: 14,
    },
    kvInput: {
        flex: 1,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
    },
    addButtonText: {
        color: COLORS.primary,
        fontSize: 14,
    },
    bodyInput: {
        height: 200,
        textAlignVertical: 'top',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
    },
    sendButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        margin: SPACING.md,
        padding: SPACING.md,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    responseContainer: {
        marginTop: SPACING.lg,
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 100,
    },
    responseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: 4,
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    durationText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        flex: 1,
    },
    responseBodyScroll: {
        maxHeight: 400,
    },
    responseData: {
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 12,
    }
});
