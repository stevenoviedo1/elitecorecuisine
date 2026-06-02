"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ready: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Strict worker cancel flow
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    const userRole = session?.user?.role;

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [status, router]);

    const fetchOrders = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const res = await fetch("/api/orders");
            const result = await res.json();

            if (!res.ok && !result.warning) {
                throw new Error(result.error || "Failed to load orders");
            }

            const ordersData = Array.isArray(result) ? result : (result.orders || []);
            setOrders(ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setLastRefresh(new Date());

            // Show warning if Supabase is not configured
            if (result.warning) {
                setError(result.warning); // reuse error state for warning
            }
        } catch (err) {
            setError(err.message);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Auto-refresh every 25 seconds for busy kitchen environment (background)
        const interval = setInterval(() => {
            fetchOrders(true);
        }, 25000);

        return () => clearInterval(interval);
    }, []);

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status: newStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            // Optimistic update
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                        : order
                )
            );
        } catch (err) {
            alert('Failed to update order status. Please try again.');
            // Refresh to get real state
            fetchOrders();
        }
    };

    // Update payment status (very useful in busy service)
    const updatePaymentStatus = async (orderId, newPaymentStatus) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, paymentStatus: newPaymentStatus }),
            });

            if (!res.ok) throw new Error('Failed to update payment');

            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString() }
                        : order
                )
            );
        } catch (err) {
            alert('Failed to update payment status.');
            fetchOrders();
        }
    };

    // === Strict worker cancel handlers (requires reason) ===
    const startWorkerCancel = (orderId) => {
        setCancellingId(orderId);
        setCancelReason('');
    };

    const cancelWorkerCancel = () => {
        setCancellingId(null);
        setCancelReason('');
    };

    const confirmWorkerCancel = async () => {
        if (!cancellingId) return;

        const reason = cancelReason.trim();
        if (!reason) {
            alert('Please provide a reason for cancelling the order.');
            return;
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: cancellingId,
                    status: 'cancelled',
                    cancellationReason: reason,
                }),
            });

            if (!res.ok) throw new Error('Failed to cancel order');

            // Optimistic update + store reason
            setOrders(prev =>
                prev.map(order =>
                    order.id === cancellingId
                        ? {
                              ...order,
                              status: 'cancelled',
                              cancellationReason: reason,
                              updatedAt: new Date().toISOString(),
                          }
                        : order
                )
            );

            // Reset flow
            setCancellingId(null);
            setCancelReason('');
        } catch (err) {
            alert('Failed to cancel order. Please try again.');
            fetchOrders();
        }
    };

    // ============================================
    // EXCELLENT THERMAL-STYLE TICKET PRINTING
    // Works great with receipt printers (58mm / 80mm)
    // ============================================
    const printTicket = (order) => {
        const isDineIn = order.customer?.orderType === 'dine-in';
        const location = isDineIn 
            ? `TABLE ${order.customer?.tableNumber || '—'}` 
            : 'TAKEOUT - COUNTER PICKUP';

        const itemsHtml = (order.items || []).map(item => `
            <div style="display:flex; justify-content:space-between; margin:4px 0; font-size:15px;">
                <span>${item.quantity}× ${item.name}</span>
                <span style="font-weight:600;">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const printWindow = window.open('', '_blank', 'width=400,height=600');
        if (!printWindow) {
            alert('Please allow popups to print tickets.');
            return;
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ticket ${order.id}</title>
                <style>
                    @page { size: 80mm auto; margin: 0; }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 13px;
                        line-height: 1.3;
                        margin: 0;
                        padding: 8px 12px;
                        width: 78mm;
                        color: #000;
                    }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
                    .brand { font-size: 18px; font-weight: 800; letter-spacing: 1px; }
                    .order-id { font-size: 22px; font-weight: 800; margin: 6px 0; }
                    .meta { font-size: 12px; margin-bottom: 8px; }
                    .section { margin: 10px 0; border-top: 1px dashed #000; padding-top: 8px; }
                    .total { font-size: 18px; font-weight: 800; border-top: 2px solid #000; padding-top: 6px; margin-top: 8px; }
                    .footer { text-align: center; margin-top: 12px; font-size: 11px; border-top: 1px dashed #000; padding-top: 8px; }
                    button { display: none; } /* hide in print */
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="brand">ELITE CORE CUISINE</div>
                    <div style="font-size:11px;">1617 S Cage Blvd, Pharr, TX</div>
                </div>

                <div class="order-id">${order.id}</div>
                <div class="meta">
                    <strong>${new Date(order.createdAt).toLocaleString()}</strong><br/>
                    ${location}<br/>
                    ${order.customer?.name} • ${order.customer?.phone}
                </div>

                <div class="section">
                    <strong>ITEMS</strong><br/>
                    ${itemsHtml}
                </div>

                <div class="total">
                    TOTAL: $${order.total?.toFixed(2) || '0.00'}
                </div>

                <div class="section">
                    <strong>PAYMENT:</strong> ${order.customer?.paymentPreference === 'online' ? 'ONLINE (pending)' : 'IN PERSON'}<br/>
                    <strong>STATUS:</strong> ${order.status?.toUpperCase() || 'PENDING'}
                </div>

                ${order.customer?.notes ? `
                <div class="section">
                    <strong>NOTES:</strong><br/>
                    ${order.customer.notes}
                </div>` : ''}

                <div class="footer">
                    ${isDineIn ? 'DINE-IN' : 'TAKEOUT'} • Kitchen Copy<br/>
                    Thank you!
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(() => window.close(), 300);
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    // Computed stats
    const stats = useMemo(() => {
        const total = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
        const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        const pendingCount = orders.filter(o => (o.status || 'pending') === 'pending').length;

        return {
            total,
            totalRevenue: totalRevenue.toFixed(2),
            todayCount: todayOrders.length,
            todayRevenue: todayRevenue.toFixed(2),
            pendingCount,
        };
    }, [orders]);

    // Filtered + searched orders
    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                const matchesSearch =
                    !searchTerm ||
                    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.customer?.phone?.includes(searchTerm);

                const matchesStatus =
                    statusFilter === 'all' || order.status === statusFilter;

                const matchesType =
                    typeFilter === 'all' ||
                    (order.customer?.orderType || 'takeout') === typeFilter;

                return matchesSearch && matchesStatus && matchesType;
            });
    }, [orders, searchTerm, statusFilter, typeFilter]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black px-8 py-20">
                <div className="max-w-screen-2xl mx-auto">
                    <h1 className="text-5xl font-bold text-eliteRed mb-8">Order Management</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error && !orders.length) {
        // Only show full error screen if we have zero orders AND a real error
        const isConfigIssue = error.includes('Supabase') || error.includes('configured');

        return (
            <div className="min-h-screen bg-white dark:bg-black px-8 py-20">
                <div className="max-w-screen-2xl mx-auto">
                    <h1 className="text-5xl font-bold text-eliteRed mb-8">Order Management</h1>
                    
                    {isConfigIssue ? (
                        <div className="rounded-3xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-6 mb-6">
                            <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                                Supabase is not configured correctly.
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Orders cannot be loaded or saved until the Supabase service role key is fixed in <code>.env.local</code>.
                            </p>
                            <p className="text-sm mt-3 text-yellow-700 dark:text-yellow-300">
                                You can still use the dashboard UI. Once Supabase is fixed, restart the server.
                            </p>
                        </div>
                    ) : (
                        <p className="text-red-600">Error loading orders: {error}</p>
                    )}

                    <Link href="/" className="text-eliteGold underline">← Back to site</Link>
                </div>
            </div>
        );
    }

    const isOwner = userRole === 'owner';
    const isWorker = userRole === 'worker';

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-5xl font-bold text-eliteRed tracking-tight">
                                {isOwner ? 'Order Management' : 'Kitchen Dashboard'}
                            </h1>
                            {userRole && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isOwner ? 'bg-eliteGold text-black' : 'bg-blue-600 text-white'}`}>
                                    {userRole}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {isOwner 
                                ? 'Elite Core Cuisine — Owner Control Center' 
                                : 'Elite Core Cuisine — Kitchen Workflow'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Website orders (online / takeout / dine-in) appear here automatically. Use Print Ticket for the kitchen. Keep your existing POS for counter payments if desired.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="text-right text-sm mr-2 hidden md:block">
                            <div className="font-medium text-gray-700 dark:text-gray-200">{session?.user?.name}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">{session?.user?.email}</div>
                        </div>
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-eliteGold text-eliteGold hover:bg-eliteGold hover:text-black transition font-semibold text-sm"
                        >
                            ← Back to Website
                        </Link>
                        <button 
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Stats Dashboard - Role differentiated */}
                <div className={`grid gap-4 mb-8 ${isOwner ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
                        <div className="text-4xl font-bold text-eliteRed mt-1">{stats.total}</div>
                    </div>

                    {isOwner && (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Total Revenue (All Time)</div>
                            <div className="text-4xl font-bold text-eliteGold mt-1">${stats.totalRevenue}</div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Orders Today</div>
                        <div className="text-4xl font-bold text-eliteRed mt-1">{stats.todayCount}</div>
                    </div>

                    {isOwner ? (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Revenue Today</div>
                            <div className="text-4xl font-bold text-eliteGold mt-1">${stats.todayRevenue}</div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Needs Attention</div>
                            <div className="text-4xl font-bold text-yellow-600 mt-1">{stats.pendingCount}</div>
                        </div>
                    )}
                </div>

                {/* Kitchen Alert - more prominent for workers */}
                {stats.pendingCount > 0 && (
                    <div className="mb-6 rounded-2xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <i className="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400"></i>
                            <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                                {stats.pendingCount} order{stats.pendingCount > 1 ? 's' : ''} waiting to be started
                                {!isOwner && ' — Kitchen priority'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-lg focus:outline-none focus:border-eliteRed"
                    />

                    <div className="flex flex-wrap gap-2">
                        {['all', 'takeout', 'dine-in'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={`px-4 py-2 rounded-2xl text-sm font-medium transition border ${
                                    typeFilter === t 
                                        ? 'bg-eliteRed text-white border-eliteRed' 
                                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {t === 'all' ? 'All Types' : t === 'dine-in' ? 'Dine In' : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium"
                    >
                        <option value="all">All Statuses</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => fetchOrders()}
                        className="px-6 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 transition"
                    >
                        Refresh
                    </button>
                    <div className="text-[10px] text-gray-400 self-center hidden md:block">
                        Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>

                {/* Owner-only hint */}
                {isOwner && (
                    <div className="mb-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <i className="fas fa-crown text-eliteGold"></i>
                        <span>Owner mode: Full financial visibility + complete control over all order states and history.</span>
                    </div>
                )}

                {/* Supabase Configuration Warning */}
                {error && error.includes('Supabase') && (
                    <div className="mb-6 rounded-3xl border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-4 text-sm">
                        <strong className="text-yellow-800 dark:text-yellow-200">Warning:</strong>{' '}
                        <span className="text-yellow-700 dark:text-yellow-300">{error}</span>
                        <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                            Fix your Supabase service role key in <code>.env.local</code> then restart the dev server.
                        </div>
                    </div>
                )}

                {/* Owner-only: Change Password (optional / collapsed by default) */}
                {isOwner && (
                    <details className="mb-8 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 md:p-8 shadow-sm">
                        <summary className="cursor-pointer text-lg font-semibold text-eliteRed flex items-center gap-2">
                            <i className="fas fa-key text-eliteGold"></i>
                            Change Password (optional)
                        </summary>
                        <div className="mt-4">
                            <OwnerChangePassword />
                        </div>
                    </details>
                )}

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
                        <p className="text-2xl text-gray-500 dark:text-gray-400">No orders match your filters.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const currentStatus = order.status || 'pending';
                            return (
                                <div 
                                    key={order.id} 
                                    className="border border-gray-200 dark:border-gray-700 rounded-3xl p-6 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-eliteGold/30 transition-all duration-200"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-eliteRed">{order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[currentStatus]}`}>
                                                    {currentStatus}
                                                </span>
                                                {/* Placeholder for future POS integration visibility */}
                                                <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-medium tracking-wide">
                                                    WEBSITE
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(order.createdAt).toLocaleString()}
                                                {order.updatedAt && ` • Updated ${new Date(order.updatedAt).toLocaleTimeString()}`}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-eliteGold">${order.total?.toFixed(2)}</div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                    {order.customer?.orderType === 'dine-in' 
                                                        ? `Dine-in • Table ${order.customer?.tableNumber || '?'}` 
                                                        : 'Takeout'}
                                                </div>
                                            </div>

                                            {/* Print Ticket - excellent for busy kitchen */}
                                            <button
                                                onClick={() => printTicket(order)}
                                                className="px-4 py-2 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-black active:scale-[0.985] flex items-center gap-2 border border-gray-700"
                                                title="Print thermal receipt / kitchen ticket"
                                            >
                                                <i className="fas fa-print"></i>
                                                <span className="hidden sm:inline">Print Ticket</span>
                                            </button>

                                            {/* Role-aware status controls */}
                                            {isOwner ? (
                                                /* Owner: full control select */
                                                <select
                                                    value={currentStatus}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className="border border-gray-300 dark:border-gray-700 rounded-2xl px-3 py-2 text-sm bg-white dark:bg-gray-900 font-medium focus:outline-none focus:border-eliteRed"
                                                >
                                                    {STATUS_OPTIONS.map(s => (
                                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                /* Worker: big, clear workflow buttons (strict cancel) */
                                                <div className="flex flex-wrap gap-1.5">
                                                    {cancellingId === order.id ? (
                                                        // Strict cancel flow: require reason
                                                        <div className="w-full max-w-xs bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-3 space-y-2">
                                                            <div className="text-xs font-semibold text-red-700 dark:text-red-300">Cancel order — required reason</div>
                                                            <textarea
                                                                value={cancelReason}
                                                                onChange={(e) => setCancelReason(e.target.value)}
                                                                placeholder="e.g. Customer no longer wants the order, duplicate order, etc."
                                                                className="w-full text-sm rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-gray-900 p-2 focus:outline-none focus:border-red-500"
                                                                rows={2}
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={confirmWorkerCancel}
                                                                    className="flex-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                                                                >
                                                                    Confirm Cancel
                                                                </button>
                                                                <button
                                                                    onClick={cancelWorkerCancel}
                                                                    className="flex-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                                >
                                                                    Keep Order
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {currentStatus === 'pending' && (
                                                                <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">Start Preparing</button>
                                                            )}
                                                            {currentStatus === 'preparing' && (
                                                                <button onClick={() => updateOrderStatus(order.id, 'ready')} className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition">Mark Ready</button>
                                                            )}
                                                            {currentStatus === 'ready' && (
                                                                <button onClick={() => updateOrderStatus(order.id, 'completed')} className="px-3 py-1.5 text-xs font-bold rounded-xl bg-green-600 text-white hover:bg-green-700 transition">Complete Order</button>
                                                            )}
                                                            {['preparing', 'ready'].includes(currentStatus) && (
                                                                <button onClick={() => updateOrderStatus(order.id, 'pending')} className="px-2.5 py-1.5 text-xs font-medium rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">Back</button>
                                                            )}
                                                            {/* Workers can only cancel early-stage orders (stricter) */}
                                                            {['pending', 'preparing'].includes(currentStatus) && (
                                                                <button
                                                                    onClick={() => startWorkerCancel(order.id)}
                                                                    className="px-2.5 py-1.5 text-xs font-medium rounded-xl border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cancellation reason (visible for both roles when present) */}
                                    {order.cancellationReason && (
                                        <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-2.5 text-sm">
                                            <span className="font-semibold text-red-700 dark:text-red-300">Cancellation reason: </span>
                                            <span className="text-red-600 dark:text-red-200">{order.cancellationReason}</span>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                                        {/* Customer */}
                                        <div>
                                            <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Customer</div>
                                            <div className="space-y-0.5">
                                                <div><span className="font-medium">{order.customer?.name}</span></div>
                                                <div>{order.customer?.phone}</div>
                                                {order.customer?.orderType === 'dine-in' && order.customer?.tableNumber && (
                                                    <div className="font-semibold text-eliteRed">Table {order.customer.tableNumber}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div>
                                            <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                                                Items ({order.items?.length || 0})
                                            </div>
                                            <div className="space-y-1 max-h-24 overflow-auto pr-1 text-sm">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span>{item.quantity}× {item.name}</span>
                                                        <span className="font-medium tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Notes</div>
                                            <div className="text-gray-600 dark:text-gray-300">
                                                {order.customer?.notes || <span className="italic text-gray-400">No special instructions</span>}
                                            </div>
                                        </div>

                                        {/* Payment Status - critical for busy service */}
                                        <div>
                                            <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Payment</div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                    {order.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {order.customer?.paymentPreference === 'online' ? 'Online' : 'In Person'}
                                                </span>
                                                <button
                                                    onClick={() => updatePaymentStatus(order.id, order.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                                                    className="ml-2 text-[10px] px-2 py-0.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                    {order.paymentStatus === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-10 text-xs text-center text-gray-400">
                    Internal tool • {isOwner ? 'Owner access • ' : 'Worker access • '}Stored in Supabase (production database)
                </div>
            </div>
        </div>
    );
}

// ============================================
// Owner-only Change Password Component
// ============================================
function OwnerChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to change password');
            }

            setMessage({ type: 'success', text: 'Password changed successfully!' });
            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Auto-clear success message
            setTimeout(() => setMessage(null), 4000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Update your owner account password. This change takes effect immediately.
            </p>

            {message && (
                <div className={`mb-5 rounded-2xl px-4 py-3 text-sm font-medium ${
                    message.type === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                        Current Password
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-lg focus:border-eliteRed focus:outline-none"
                        placeholder="Enter current password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-lg focus:border-eliteRed focus:outline-none"
                        placeholder="At least 6 characters"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-lg focus:border-eliteRed focus:outline-none"
                        placeholder="Re-enter new password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
                    className="mt-2 w-full rounded-2xl bg-eliteRed py-3.5 text-lg font-bold text-white transition hover:bg-eliteGold hover:text-black active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Updating Password...' : 'Update Password'}
                </button>
            </form>

            <div className="mt-4 text-[10px] text-gray-500 dark:text-gray-400">
                Password changes are stored securely with hashing in Supabase.
            </div>
        </div>
    );
}
