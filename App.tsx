
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  TrendingUp, 
  Settings, 
  ExternalLink,
  RefreshCw,
  Bell,
  Search,
  ShoppingCart,
  Database,
  Zap,
  ShieldCheck,
  BarChart3,
  Globe,
  MonitorCheck,
  ArrowUpRight,
  Sparkles,
  Edit3,
  Trash2,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Product, Order, MarketTrend } from './types';
import { extractProductData, researchWinningProducts } from './services/geminiService';
import DashboardCard from './components/DashboardCard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'import' | 'drafts' | 'products' | 'orders' | 'research' | 'settings'>('dashboard');
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchResults, setResearchResults] = useState<MarketTrend[]>([]);
  const [searchNiche, setSearchNiche] = useState('أجهزة منزلية ذكية');
  
  // State for products
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'p1',
      title: 'ساعة ذكية Series 9 Pro Max - شاشة AMOLED',
      sourceUrl: 'https://amazon.com/example',
      supplierName: 'Amazon',
      supplierPrice: 180,
      listingPrice: 249,
      inventoryCount: 42,
      images: ['https://picsum.photos/400/400?random=10'],
      status: 'active',
      platform: 'both',
      lastSync: 'قبل دقيقة واحدة',
      roi: 38,
      profit: 69
    }
  ]);

  const [drafts, setDrafts] = useState<Product[]>([
    {
      id: 'd1',
      title: 'كاميرا مراقبة لاسلكية 4K مع رؤية ليلية',
      sourceUrl: 'https://aliexpress.com/example',
      supplierName: 'AliExpress',
      supplierPrice: 45,
      listingPrice: 89,
      inventoryCount: 150,
      images: ['https://picsum.photos/400/400?random=22'],
      status: 'draft',
      platform: 'shopify',
      lastSync: 'بانتظار التصدير',
      roi: 97,
      profit: 44
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-5542',
      customerName: 'سارة خالد',
      productTitle: 'ساعة ذكية Series 9 Pro Max',
      status: 'shipped',
      platform: 'shopify',
      trackingNumber: 'LH123456789CN',
      orderDate: '2023-10-25'
    },
    {
      id: 'ORD-9910',
      customerName: 'فهد الأحمد',
      productTitle: 'كاميرا مراقبة 4K',
      status: 'processing',
      platform: 'ebay',
      orderDate: '2023-10-26'
    }
  ]);

  const handleImport = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    try {
      const data = await extractProductData(importUrl);
      const newDraft: Product = {
        id: 'draft_' + Math.random().toString(36).substr(2, 5),
        title: data.title,
        sourceUrl: importUrl,
        supplierName: data.category || 'مورد عالمي',
        supplierPrice: data.price,
        listingPrice: data.suggestedRetailPrice || (data.price * 1.5),
        inventoryCount: data.inventory,
        images: data.images,
        status: 'draft',
        platform: 'both',
        lastSync: 'الآن',
        roi: Math.round((( (data.suggestedRetailPrice || data.price * 1.5) - data.price) / data.price) * 100),
        profit: (data.suggestedRetailPrice || data.price * 1.5) - data.price
      };
      setDrafts([newDraft, ...drafts]);
      setImportUrl('');
      setActiveTab('drafts');
    } catch (err) {
      alert("حدث خطأ أثناء تحليل الرابط. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsImporting(false);
    }
  };

  const exportToStore = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      const activeProduct: Product = { ...draft, status: 'active', lastSync: 'تم التصدير للتو' };
      setProducts([activeProduct, ...products]);
      setDrafts(drafts.filter(d => d.id !== draftId));
      setActiveTab('products');
    }
  };

  const handleResearch = async () => {
    setIsResearching(true);
    try {
      const results = await researchWinningProducts(searchNiche);
      setResearchResults(results);
    } finally {
      setIsResearching(false);
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, count }: { id: any, icon: any, label: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'text-gray-500 hover:bg-slate-50 hover:text-indigo-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={activeTab === id ? '' : 'group-hover:scale-110 transition-transform'} />
        <span className="font-bold text-sm">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-['Cairo'] text-slate-800">
      {/* Sidebar - AutoDS Inspired */}
      <aside className="w-64 bg-white border-l border-slate-200 p-5 flex flex-col fixed h-full right-0 z-50">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Zap size={20} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">DropStream</span>
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">AutoDS Cloud</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="نظرة عامة" />
          <SidebarItem id="import" icon={PlusCircle} label="أداة الاستيراد" />
          <SidebarItem id="drafts" icon={FileText} label="المسودات" count={drafts.length} />
          <SidebarItem id="products" icon={Package} label="المتجر (نشط)" count={products.length} />
          <SidebarItem id="orders" icon={Truck} label="الطلبات" count={orders.filter(o => o.status !== 'delivered').length} />
          <SidebarItem id="research" icon={Sparkles} label="الباحث الذكي" />
          <div className="h-px bg-slate-100 my-4 mx-2"></div>
          <SidebarItem id="settings" icon={Settings} label="الإعدادات" />
        </nav>

        <div className="mt-auto space-y-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase">مراقبة المخزون</p>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-[11px] font-bold text-slate-600 leading-tight">تحديث الأسعار يعمل الآن لـ 52 مورد.</p>
          </div>
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">AM</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate">أحمد محمد</p>
              <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-tighter">Business Plus</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 mr-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'اللوحة الرئيسية'}
              {activeTab === 'import' && 'استيراد من الموردين'}
              {activeTab === 'drafts' && 'المسودات والمراجعة'}
              {activeTab === 'products' && 'المنتجات النشطة'}
              {activeTab === 'orders' && 'إدارة الطلبات والتتبع'}
              {activeTab === 'research' && 'اكتشاف الترندات'}
              {activeTab === 'settings' && 'تكوين الأتمتة'}
            </h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">مركز التحكم المتكامل للدروبشيبينغ</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                <Globe size={14} className="text-indigo-500 ml-2" />
                <span className="text-xs font-bold text-slate-700">Shopify + eBay</span>
             </div>
             <button className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
               <RefreshCw size={18} />
             </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <DashboardCard title="المبيعات اليومية" value="$1,240" icon={<ShoppingCart size={18} />} trend="+12%" color="bg-indigo-500" />
              <DashboardCard title="الأرباح الصافية" value="$450" icon={<TrendingUp size={18} />} trend="+8%" color="bg-emerald-500" />
              <DashboardCard title="طلبات بانتظار الشحن" value={orders.filter(o => o.status === 'processing').length} icon={<Truck size={18} />} color="bg-orange-500" />
              <DashboardCard title="عمليات المزامنة" value="1.4k" icon={<Zap size={18} />} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-black text-lg">أحدث الطلبات المؤتمتة</h2>
                      <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">عرض الكل <ArrowUpRight size={14}/></button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-right">
                        <thead>
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="pb-4">الطلب</th>
                            <th className="pb-4">المنتج</th>
                            <th className="pb-4">المنصة</th>
                            <th className="pb-4">الحالة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-all">
                              <td className="py-4 text-xs font-bold text-slate-900">{order.id}</td>
                              <td className="py-4 text-xs font-medium text-slate-600 truncate max-w-[150px]">{order.productTitle}</td>
                              <td className="py-4">
                                <span className={`text-[10px] font-black uppercase ${order.platform === 'shopify' ? 'text-green-600' : 'text-red-500'}`}>
                                  {order.platform}
                                </span>
                              </td>
                              <td className="py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  order.status === 'shipped' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                  {order.status === 'shipped' ? 'تم الشحن' : 'قيد المعالجة'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <Sparkles className="text-indigo-400 mb-6" size={32} />
                    <h3 className="text-xl font-black mb-3">اقتناص المنتجات الرابحة</h3>
                    <p className="text-xs text-indigo-200 leading-relaxed mb-8">يقوم AI بتحليل أكثر من 500 ترند حالي ليقترح عليك نيشات رابحة فوراً.</p>
                    <button onClick={() => setActiveTab('research')} className="w-full py-3.5 bg-white text-indigo-900 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform shadow-xl">ابدأ التحليل الآن</button>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-800 rounded-full blur-3xl opacity-30"></div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200">
                    <h4 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <MonitorCheck size={14} className="text-indigo-500" />
                      مراقبة الموردين (آخر 15د)
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600">AliExpress Global</span>
                        <span className="text-emerald-500">مستقر</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600">Amazon Prime</span>
                        <span className="text-emerald-500">مستقر</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600">CJDropshipping</span>
                        <span className="text-orange-400">تأخير بسيط</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-300">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="text-center relative z-10 mb-10">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <PlusCircle size={32} />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">استيراد منتج ذكي</h2>
                <p className="text-slate-500 text-sm font-medium">نظام DropStream يدعم أكثر من 50 مورداً عالمياً بجلب البيانات الفوري.</p>
              </div>

              <div className="relative z-10 space-y-6">
                <div className="relative">
                  <input 
                    type="url" 
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://aliexpress.com/item/..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[10px] uppercase">Direct Link</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['AliExpress', 'Amazon', 'eBay', 'CJDropshipping'].map(s => (
                    <div key={s} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col items-center gap-1 hover:border-indigo-200 transition-all cursor-pointer">
                      <Database size={16} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-600">{s}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleImport}
                  disabled={isImporting || !importUrl}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                >
                  {isImporting ? <RefreshCw className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" />}
                  بدء الجلب والأتمتة
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-30 blur-3xl"></div>
            </div>
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black flex items-center gap-2">
                <FileText size={20} className="text-indigo-500" />
                المسودات المجهزة ({drafts.length})
              </h2>
              <button className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100">تصدير الكل للمتجر</button>
            </div>
            
            {drafts.length === 0 ? (
              <div className="bg-white p-24 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                 <p className="text-slate-400 font-bold mb-4">لا توجد مسودات حالياً. ابدأ باستيراد بعض المنتجات.</p>
                 <button onClick={() => setActiveTab('import')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs">استورد منتجك الأول</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {drafts.map(d => (
                  <div key={d.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                    <img src={d.images[0]} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{d.supplierName}</span>
                         <div className="flex gap-1">
                           <ShieldCheck size={12} className="text-emerald-500" />
                           <span className="text-[10px] font-bold text-slate-400">SEO Optimized</span>
                         </div>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 truncate mb-3">{d.title}</h3>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">سعر المورد</p>
                          <p className="text-sm font-black text-slate-800">${d.supplierPrice}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">سعر البيع المقترح</p>
                          <p className="text-sm font-black text-indigo-600">${d.listingPrice}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">الربح المتوقع</p>
                          <p className="text-sm font-black text-emerald-600">+${d.profit}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => exportToStore(d.id)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                      >
                        <ExternalLink size={14} />
                        نشر في المتجر
                      </button>
                      <div className="flex gap-2">
                        <button className="flex-1 p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors flex justify-center"><Edit3 size={16}/></button>
                        <button 
                          onClick={() => setDrafts(drafts.filter(dr => dr.id !== d.id))}
                          className="flex-1 p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors flex justify-center"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div>
                   <h2 className="text-xl font-black tracking-tight">إدارة المتجر النشط</h2>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">مزامنة الأسعار والمخزون مفعلة تلقائياً</span>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"><Search size={18} className="text-slate-400"/></button>
                   <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100">
                     <RefreshCw size={14} />
                     مزامنة فورية شاملة
                   </button>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-right">
                  <thead>
                    <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-5">المنتج والقنوات</th>
                      <th className="px-6 py-5">المورد والأسعار</th>
                      <th className="px-6 py-5">الأرباح والأداء</th>
                      <th className="px-6 py-5">الحالة</th>
                      <th className="px-6 py-5">تحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map(p => (
                      <tr key={p.id} className="group hover:bg-slate-50 transition-all">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="relative">
                                <img src={p.images[0]} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform" alt="" />
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black text-white ${p.platform === 'shopify' ? 'bg-green-500' : 'bg-red-500'}`}>
                                  {p.platform[0].toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 w-48">{p.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">آخر مزامنة: {p.lastSync}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{p.supplierName}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className="text-xs font-bold text-slate-500">${p.supplierPrice}</span>
                                 <ArrowUpRight size={10} className="text-indigo-400" />
                                 <span className="text-sm font-black text-indigo-600">${p.listingPrice}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col">
                             <span className="text-sm font-black text-emerald-600">+${p.profit}</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase">ROI: {p.roi}%</span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                 <CheckCircle2 size={12} className="text-emerald-500" />
                                 <span className="text-[10px] font-black text-emerald-600 uppercase">نشط ومتوفر</span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 pr-3.5">{p.inventoryCount} وحدة بالمخزن</span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm"><Settings size={14}/></button>
                              <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm"><ExternalLink size={14}/></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">إدارة الطلبات والتتبع التلقائي</h2>
                <div className="flex gap-2">
                   <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
                      <Zap size={14} className="text-orange-400" fill="currentColor" />
                      <span className="text-xs font-bold text-slate-600">تنفيذ تلقائي مفعل</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                     <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          order.status === 'shipped' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                           {order.status === 'shipped' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-black text-slate-900">{order.id}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className="text-[10px] font-black uppercase text-slate-400">{order.platform}</span>
                           </div>
                           <h4 className="text-sm font-bold text-slate-700">{order.productTitle}</h4>
                           <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-wider">العميل: {order.customerName} • {order.orderDate}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-12">
                        {order.trackingNumber ? (
                          <div className="text-left">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">رقم التتبع</p>
                            <p className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                              {order.trackingNumber}
                              <ExternalLink size={12} />
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-orange-400 font-bold">
                            <AlertTriangle size={14} />
                            <span className="text-[10px] uppercase">بانتظار رقم التتبع</span>
                          </div>
                        )}

                        <div className="flex flex-col items-end">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             order.status === 'shipped' ? 'bg-indigo-600 text-white' : 'bg-orange-400 text-white'
                           }`}>
                             {order.status === 'shipped' ? 'مشحون' : 'قيد المعالجة'}
                           </span>
                           <button className="text-[10px] font-bold text-slate-400 mt-2 hover:text-indigo-600">تفاصيل الطلب</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Other tabs like research and settings can be updated similarly with the AutoDS high-end UI feel */}
        {activeTab === 'research' && (
          <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center">
              <Sparkles size={40} className="text-indigo-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-2">مستشار المنتجات الرابحة</h2>
              <p className="text-slate-500 text-sm mb-8 font-medium">يقوم النظام بمسح TikTok و Google Trends لإيجاد المنتجات الأكثر مبيعاً الآن.</p>
              <div className="flex max-w-2xl mx-auto gap-3">
                <input 
                  type="text" 
                  value={searchNiche}
                  onChange={(e) => setSearchNiche(e.target.value)}
                  className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 font-bold transition-all shadow-inner"
                  placeholder="أدخل مجال العمل (مثال: ألعاب ذكاء)"
                />
                <button 
                  onClick={handleResearch}
                  disabled={isResearching}
                  className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {isResearching ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  استكشاف
                </button>
              </div>
            </div>

            {researchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {researchResults.map((res, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        res.demandLevel === 'high' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        طلب {res.demandLevel === 'high' ? 'مرتفع' : 'متزايد'}
                      </span>
                      <TrendingUp size={18} className="text-indigo-400" />
                    </div>
                    <h4 className="text-lg font-black mb-3 text-slate-900 leading-tight">{res.productName}</h4>
                    <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium">{res.reasoning}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                      <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mb-1">الأرباح المتوقعة</p>
                        <p className="text-xl font-black text-indigo-600">{res.estimatedProfit}</p>
                      </div>
                      <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <PlusCircle size={22} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8 animate-in slide-in-from-left-4 duration-500">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">قواعد الأتمتة الذكية</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-wider">تحكم في محرك DropStream للأسعار والمخزون</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pr-1">هامش الربح الثابت ($)</label>
                    <input type="number" defaultValue="20" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 font-black outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pr-1">هامش الربح النسبي (%)</label>
                    <input type="number" defaultValue="35" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 font-black outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="pt-2">
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <span className="text-xs font-black text-slate-700">التنفيذ التلقائي للطلبات</span>
                       <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                         <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                       </div>
                     </div>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100/50 relative overflow-hidden flex flex-col justify-center">
                   <div className="relative z-10">
                     <h4 className="font-black text-indigo-900 mb-4 text-sm uppercase tracking-wide">أتمتة AutoDS الكاملة</h4>
                     <ul className="space-y-4">
                       {[
                         "مراقبة الأسعار كل 15 دقيقة فوراً.",
                         "رفع رقم التتبع للمتجر تلقائياً عند صدوره.",
                         "تحليل تقييمات المورد لاستبعاد المنتجات الرديئة.",
                         "دعم تحويل العملات بأسعار الصرف الحية."
                       ].map((txt, i) => (
                         <li key={i} className="flex gap-3 text-xs font-bold text-indigo-700/80 leading-relaxed">
                           <CheckCircle2 size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                           {txt}
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100/40 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <h3 className="text-xl font-black mb-8 tracking-tight">المنصات المتصلة</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-slate-100 rounded-[2rem] flex flex-col gap-6 hover:border-indigo-100 transition-all group">
                    <div className="flex items-center justify-between">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" className="h-8" alt="eBay" />
                       <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                          <span className="text-[9px] font-black text-emerald-600 uppercase">نشط</span>
                       </div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">eBay Global (ahmed_store)</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">آخر فحص للطلبات: منذ 3د</p>
                    </div>
                    <button className="mt-2 py-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest text-right">قطع الاتصال</button>
                  </div>

                  <div className="p-6 border-2 border-slate-100 rounded-[2rem] flex flex-col gap-6 hover:border-indigo-100 transition-all group">
                    <div className="flex items-center justify-between">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" className="h-8" alt="Shopify" />
                       <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                          <span className="text-[9px] font-black text-emerald-600 uppercase">نشط</span>
                       </div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Shopify (drop-demo.shopify.com)</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">مزامنة المخزون: الآن</p>
                    </div>
                    <button className="mt-2 py-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest text-right">قطع الاتصال</button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
