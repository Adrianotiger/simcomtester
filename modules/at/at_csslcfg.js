let AT_CSSLCFG = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Configure SSL Parameters of a Context Identifier",
      cmd: "AT+CSSLCFG",
      doc: "11.2.1"
    }); //true, true, false, false, "Configure SSL Parameters of a Context Identifier", "", "AT+CSSLCFG", 1000);
    
    let enumC = [];
    enumC.push(new ATEnum("SSLVERSION", "SSLVERSION"));
    enumC.push(new ATEnum("CIPHERSUITE", "CIPHERSUITE"));
    enumC.push(new ATEnum("IGNORERTCTIME", "IGNORERTCTIME"));
    enumC.push(new ATEnum("PROTOCOL", "PROTOCOL"));
    enumC.push(new ATEnum("SNI", "SNI"));
    enumC.push(new ATEnum("CTXINDEX", "CTXINDEX"));
    enumC.push(new ATEnum("MAXFRAGLENDISABLE", "MAXFRAGLENDISABLE"));
    enumC.push(new ATEnum("CONVERT", "CONVERT"));
    enumC.push(new ATEnum("CERTDISABLE", "CERTDISABLE"));
    
    let enumI = [];
    enumI.push(new ATEnum(0, "index 0"));
    enumI.push(new ATEnum(1, "index 1"));
    enumI.push(new ATEnum(2, "index 2"));
    enumI.push(new ATEnum(3, "index 3"));
    enumI.push(new ATEnum(4, "index 4"));
    enumI.push(new ATEnum(5, "index 5"));
    
    let enumS = [];
    enumS.push(new ATEnum(0, "QAPI_NET_SSL_PROTOCOL_UNKNOWN"));
    enumS.push(new ATEnum(1, "QAPI_NET_SSL_PROTOCOL_TLS_1_0"));
    enumS.push(new ATEnum(2, "QAPI_NET_SSL_PROTOCOL_TLS_1_1"));
    enumS.push(new ATEnum(3, "QAPI_NET_SSL_PROTOCOL_TLS_1_2"));
    enumS.push(new ATEnum(4, "QAPI_NET_SSL_PROTOCOL_DTLS_1_0"));
    enumS.push(new ATEnum(5, "QAPI_NET_SSL_PROTOCOL_DTLS_1_2"));
    enumS.push(new ATEnum(6, "QAPI_NET_SSL_PROTOCOL_TLS_1_3"));
    
    let enumP = [];
    enumP.push(new ATEnum(1, "QAPI_NET_SSL_TLS_E"));
    enumP.push(new ATEnum(2, "QAPI_NET_SSL_DTLS_E"));
    
    let enumST = [];
    enumST.push(new ATEnum(1, "QAPI_NET_SSL_CERTIFICATE_E"));
    enumST.push(new ATEnum(2, "QAPI_NET_SSL_CA_LIST_E"));
    enumST.push(new ATEnum(3, "QAPI_NET_SSL_PSK_TABLE_E"));
            
    this.AddParam("context", enumC, "context");
    this.AddParam("ctxindex", enumI, "context identifier");
    this.AddParam("sslversion", enumS, "ssl version");
    this.AddParam("protocol", enumP, "protocol");
    this.AddParam("ssltype", enumST, "ssl type");
    this.AddParam("cname", "string", "cname");
    this.AddParam("keyname", "string", "key name");
    this.AddParam("passkey", "string", "pass key");
    this.AddParam("servername", "string", "servername");
    
    this.AddWriteSendParam({context:"SSLVERSION", ctxindex:null, sslversion:null});
    this.AddWriteSendParam({context:"PROTOCOL", ctxindex:null, protocol:null});
    this.AddWriteSendParam({context:"CONVERT", ssltype:null, cname:null});
    this.AddWriteSendParam({context:"CONVERT", ssltype:null, cname:null, keyname:null});
    this.AddWriteSendParam({context:"CONVERT", ssltype:null, cname:null, keyname:null, passkey:null});
    this.AddWriteSendParam({context:"SNI", ctxindex:null, servername:null});
    
    
  }
  
};