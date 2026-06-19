Created At: 2026-06-01T01:22:47Z
Completed At: 2026-06-01T01:22:47Z
File Path: `file:///c:/Users/cii/Desktop/Ha%C5%9Fere%20%C4%B0la%C3%A7lama/frontend/src/App.jsx`
Total Lines: 4861
Total Bytes: 231675
Showing lines 800 to 1200
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
800:               <button type="button" className="btn btn-secondary" style={{ width: 'auto', padding: '8px 20px', marginLeft: 'auto' }} onClick={() => setViewingStationHistory(null)}>Kapat</button>
801:             </div>
802:           </div>
803:         </div>
804:       )}
805: 
806:     </div>
807:   );
808: }
809: 
810: export default function App() {
811:   // Oturum Durumları
812:   const [user, setUser] = useState(null);
813:   const [token, setToken] = useState('');
814:   
815:   // Arayüz Durumları
816:   const [activeTab, setActiveTab] = useState('daily_plan'); // Varsayılan sekme Günlük Plan (İş Listesi)
817:   const [customers, setCustomers] = useState([]);
818:   const [searchQuery, setSearchQuery] = useState('');
819: 
820:   const handleSearchChange = (val) => {
821:     setSearchQuery(val);
822:     if (val.length >= 3) {
823:       const query = val.toLowerCase();
824:       const matched = customers.find(c => 
825:         c.unvan.toLowerCase().includes(query) || 
826:         (c.vergi_no && c.vergi_no.includes(query)) ||
827:         c.telefon.includes(query) ||
828:         c.adres.toLowerCase().includes(query)
829:       );
830:       if (matched) {
831:         setSelectedCustomerForDetail(matched);
832:         setSearchQuery('');
833:       }
834:     }
835:   };
836:   
837:   // Modal Durumları
838:   const [showAddModal, setShowAddModal] = useState(false);
839:   const [showEditModal, setShowEditModal] = useState(false);
840:   const [selectedCustomer, setSelectedCustomer] = useState(null);
841:   
842:   // Bil
<truncated 14487 bytes>
l>\n`;
1152:       xml += '   </Row>\n';
1153:     });
1154:     
1155:     xml += '  </Table>\n';
1156:     xml += ' </Worksheet>\n';
1157:     xml += '</Workbook>\n';
1158:     
1159:     // Tarayıcı üzerinden Excel dosyasını tetikle
1160:     const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
1161:     const url = window.URL.createObjectURL(blob);
1162:     const a = document.createElement('a');
1163:     a.href = url;
1164:     a.download = `Korfez_Ilaclama_Hizmet_Raporu_${selectedReportMonth || 'Tum_Donemler'}.xls`;
1165:     document.body.appendChild(a);
1166:     a.click();
1167:     document.body.removeChild(a);
1168:     window.URL.revokeObjectURL(url);
1169:   };
1170: 
1171:   // Kütüphaneye yeni ilaç ekle
1172:   const handleAddBiocide = async (e) => {
1173:     e.preventDefault();
1174:     setError('');
1175:     try {
1176:       const response = await fetch(`${API_URL}/api/ek1/products`, {
1177:         method: 'POST',
1178:         headers: {
1179:           'Content-Type': 'application/json',
1180:           'Authorization': `Bearer ${token}`
1181:         },
1182:         body: JSON.stringify(newBiocide)
1183:       });
1184:       const data = await response.json();
1185:       if (!response.ok) throw new Error(data.error || 'İlaç eklenemedi.');
1186:       
1187:       setSuccess('Yeni ilaç başarıyla kütüphaneye eklendi.');
1188:       setShowAddBiocideModal(false);
1189:       setNewBiocide({
1190:         commercialName: '',
1191:         licenseDate: '',
1192:         licenseNo: '',
1193:         method: 'Jel Noktalama',
1194:         activeIngredient: '',
1195:         antidote: 'Semptomatik Tedavi',
1196:         defaultQuantity: '10 gr'
1197:       });
1198:       
1199:       // Auto-fill the EK-1 form if it's currently open
1200:       if (showEk1Modal) {
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
