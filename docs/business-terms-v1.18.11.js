(()=>{
if(document.getElementById('termsModal'))return;
const TERMS_VERSION='QC-Negocios-2026-09-13-v1';

const style=document.createElement('style');
style.textContent=`
.terms-box{max-height:46vh;overflow:auto;border:1px solid var(--line);border-radius:14px;background:#fafafa;padding:14px 16px;margin:12px 0;line-height:1.48}
.terms-box h4{margin:13px 0 5px;font-size:14px;color:var(--ink)}.terms-box h4:first-child{margin-top:0}
.terms-box p{margin:5px 0 9px;font-size:12px;color:#475467}.terms-box ul{margin:5px 0 10px;padding-left:20px;color:#475467}.terms-box li{font-size:12px;margin:6px 0}
.terms-accept{display:flex;gap:10px;align-items:flex-start;border:1px solid #fedf89;background:#fffaeb;border-radius:12px;padding:12px 13px;margin-top:12px}
.terms-accept input{width:20px;height:20px;flex:0 0 20px;margin-top:1px}.terms-accept label{font-size:12px;font-weight:800;line-height:1.4;color:#7a2e0e;cursor:pointer}
.terms-version{font-size:10px;color:var(--muted);margin-top:8px}.terms-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.terms-actions .btn{flex:1 1 180px}
`;
document.head.appendChild(style);

const modal=document.createElement('div');
modal.className='modal';
modal.id='termsModal';
modal.innerHTML=`
<div class="modalhead"><h3>Términos y condiciones para negocios</h3></div>
<div class="modalbody">
  <div class="notice"><b>Antes de enviar tu solicitud de activación debes aceptar estas condiciones.</b> Aplican al establecimiento <span id="termsBusinessName"></span>.</div>
  <div class="terms-box">
    <h4>1. Responsabilidad sobre alimentos y productos</h4>
    <p>El negocio declara que es el único responsable de preparar, conservar, empacar y entregar los alimentos o productos que ofrece mediante Qué Comer Hoy.</p>
    <ul>
      <li>Preparará y entregará alimentos frescos, en condiciones higiénicas y aptas para consumo, usando insumos y productos de calidad.</li>
      <li>Cumplirá las disposiciones sanitarias, permisos, licencias, avisos, obligaciones fiscales y demás requisitos legales que correspondan a su actividad.</li>
      <li>Será responsable de informar correctamente ingredientes, porciones, características, precios y, cuando corresponda, alérgenos o riesgos asociados a sus productos.</li>
      <li>Responderá directamente ante el cliente por calidad, inocuidad, contaminación, preparación, empaque, conservación, faltantes, sustituciones o cualquier problema atribuible al producto o servicio del negocio.</li>
    </ul>

    <h4>2. Cumplimiento de pedidos</h4>
    <p>Al mantener productos disponibles y aceptar pedidos, el negocio se compromete a atenderlos de forma seria y oportuna.</p>
    <ul>
      <li>Preparará el pedido conforme a lo solicitado por el cliente y respetará los precios y promociones vigentes mostrados en la plataforma.</li>
      <li>Si no puede cumplir un pedido, deberá comunicarlo y gestionarlo oportunamente; no deberá marcar como surtido, listo o entregado un pedido que no haya sido atendido realmente.</li>
      <li>Será responsable de entregar el pedido en el lugar, fecha y horario acordados con el cliente, ya sea mediante personal propio o el medio que el negocio determine.</li>
    </ul>

    <h4>3. Entrega, efectivo y cambio</h4>
    <ul>
      <li>Cuando el cliente elija pago en efectivo, el negocio deberá llevar cambio suficiente y realizar correctamente el cobro.</li>
      <li>El negocio es responsable del traslado, entrega física, manejo del efectivo y seguridad de su personal durante la entrega.</li>
      <li>Qué Comer Hoy no es responsable por pérdidas de efectivo, falta de cambio, retrasos de entrega, incidentes durante el traslado o acuerdos particulares entre negocio y cliente.</li>
    </ul>

    <h4>4. Comisión por uso de la plataforma</h4>
    <p>El negocio acepta que el uso de Qué Comer Hoy genera una comisión por los pedidos procesados mediante la plataforma. El porcentaje aplicable será el asignado al negocio por Control Central y podrá variar conforme a las condiciones comerciales vigentes.</p>
    <ul>
      <li>La comisión se calcula conforme a la configuración vigente de la plataforma.</li>
      <li>El negocio acepta que los reportes del visor y del Control Central se utilicen para determinar ventas, comisiones y montos netos.</li>
    </ul>

    <h4>5. Función de Qué Comer Hoy</h4>
    <p>Qué Comer Hoy es una herramienta tecnológica de intermediación para publicar productos, recibir pedidos y facilitar la comunicación entre clientes y negocios. La plataforma y su desarrollador no preparan, fabrican, almacenan, manipulan ni transportan los alimentos o productos vendidos por los negocios.</p>
    <p>El negocio conserva el control y la responsabilidad sobre su operación, personal, productos, entregas, cobros, cumplimiento normativo y atención al cliente.</p>

    <h4>6. Reclamos, daños y uso indebido</h4>
    <ul>
      <li>El negocio atenderá los reclamos relacionados con la calidad, cantidad, preparación, entrega o cobro de sus pedidos.</li>
      <li>El negocio se compromete a mantener información verdadera y a no usar la plataforma para actividades ilícitas, engañosas, peligrosas o que vulneren derechos de terceros.</li>
      <li>Qué Comer Hoy podrá pausar, bloquear o cancelar el acceso de un negocio ante incumplimientos, quejas graves, uso indebido, falta de pago de comisiones o riesgos para clientes o para la plataforma.</li>
    </ul>

    <h4>7. Disponibilidad del servicio</h4>
    <p>La plataforma se proporciona como herramienta tecnológica y puede requerir mantenimiento, actualizaciones o depender de servicios de terceros e Internet. No se garantiza un volumen mínimo de pedidos, ventas ni disponibilidad ininterrumpida.</p>

    <h4>8. Declaración del representante</h4>
    <p>Quien solicita la activación declara ser propietario, representante, encargado o persona autorizada para aceptar estas condiciones en nombre del establecimiento y proporcionar sus datos para la operación del servicio.</p>

    <h4>9. Derechos legales</h4>
    <p>Estas condiciones no eliminan derechos u obligaciones que legalmente no puedan renunciarse. En lo no previsto se aplicará la legislación que corresponda.</p>
  </div>
  <div class="terms-accept">
    <input type="checkbox" id="acceptBusinessTerms">
    <label for="acceptBusinessTerms">He leído y acepto los Términos y Condiciones para Negocios de Qué Comer Hoy. Confirmo que tengo autorización para representar al establecimiento y acepto la responsabilidad sobre sus productos, pedidos, cobros, entregas y la comisión de la plataforma.</label>
  </div>
  <div class="terms-version">Versión de términos: ${TERMS_VERSION}</div>
  <div class="terms-actions">
    <button class="btn" id="declineBusinessTerms" type="button">No acepto / Regresar</button>
    <button class="btn primary" id="confirmBusinessTerms" type="button" disabled>Aceptar y enviar solicitud</button>
  </div>
</div>`;
document.body.insertBefore(modal,document.getElementById('toast'));

let pending=null;
const requestBtn=document.getElementById('requestActivation');
const activationModal=document.getElementById('activationModal');
const overlay=document.getElementById('overlay');
const accept=document.getElementById('acceptBusinessTerms');
const confirmBtn=document.getElementById('confirmBusinessTerms');

function showTerms(data){
  pending=data;
  document.getElementById('termsBusinessName').textContent=data.name?('“'+data.name+'”'):'';
  accept.checked=false;
  confirmBtn.disabled=true;
  activationModal?.classList.remove('show');
  overlay?.classList.add('show');
  modal.classList.add('show');
}
function returnToActivation(){
  pending=null;
  modal.classList.remove('show');
  overlay?.classList.add('show');
  activationModal?.classList.add('show');
}
accept.onchange=()=>{confirmBtn.disabled=!accept.checked};
document.getElementById('declineBusinessTerms').onclick=returnToActivation;

if(requestBtn){
  requestBtn.onclick=()=>{
    if(!A.dbUrl){toast('No se pudo conectar al sistema central. Intenta nuevamente.');return}
    const name=$('#requestBusinessName').value.trim();
    if(!name){toast('Escribe el nombre de la sucursal');return}
    const phone=$('#requestBusinessPhone').value.trim();
    const address=$('#requestBusinessAddress').value.trim();
    showTerms({name,phone,address});
  };
}

confirmBtn.onclick=async()=>{
  if(!accept.checked||!pending){toast('Debes aceptar los términos y condiciones');return}
  const {name,phone,address}=pending;
  const requestId=makeId('act'),now=new Date().toISOString();
  confirmBtn.disabled=true;
  try{
    await put('quecomer/activationRequests/'+requestId,{
      id:requestId,
      deviceId:A.deviceId,
      requestedBusinessId:A.requestedBusinessId||'',
      businessName:name,
      normalizedBusinessName:String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' '),
      phone,address,status:'pending',createdAt:now,updatedAt:now,source:'visor-negocio-compartido',
      termsAccepted:true,
      termsVersion:TERMS_VERSION,
      termsAcceptedAt:now,
      termsAcceptance:'Acepto los Términos y Condiciones para Negocios de Qué Comer Hoy',
      termsRepresentativeConfirmed:true,
      termsDeviceId:A.deviceId,
      appVersion:'1.18.11'
    });
    pending=null;
    A.requestId=requestId;
    sessionStorage.setItem('qc_activation_request_id',requestId);
    modal.classList.remove('show');
    showActivationGate('<b>Solicitud enviada correctamente.</b> Los términos y condiciones fueron aceptados y la solicitud está esperando aprobación de Control de Sistema Qué Comer!!.','pending');
    setConn(false,'Pendiente de activación');
    toast('Términos aceptados · solicitud enviada');
  }catch(e){
    confirmBtn.disabled=false;
    toast('No se pudo enviar la solicitud: '+e.message);
  }
};
})();