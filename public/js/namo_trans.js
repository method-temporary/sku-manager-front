var pe_qc={pe_aYY:"\x54\x72\x61\x6e\x73\x6c\x61\x74\x65",pe_aTM:"\x45\x78\x70\x69\x72\x65\x41\x75\x74\x68",pe_IC:"\x4a\x53\x50",URL:"",pe_atz:"",source:"\x6b\x6f",target:"\x65\x6e",content:"",pe_Ay:function(o){if(typeof o==="\x6f\x62\x6a\x65\x63\x74"){if(o.language){this.pe_IC=o.language;}if(o.url){if(o.url.lastIndexOf("\x2f")<0){o.url+="\x2f";}}if(typeof o.source!="\x75\x6e\x64\x65\x66\x69\x6e\x65\x64"){this.source=o.source;}if(typeof o.target!="\x75\x6e\x64\x65\x66\x69\x6e\x65\x64"){this.target=o.target;}if(typeof o.content!="\x75\x6e\x64\x65\x66\x69\x6e\x65\x64"){this.content=o.content;}this.URL=o.url+"\x77\x65\x62\x73\x6f\x75\x72\x63\x65\x2f"+this.pe_IC.toLowerCase()+"\x2f"+this.pe_aTM+"\x2e"+this.pe_IC.toLowerCase();this.pe_atz=o.url+"\x77\x65\x62\x73\x6f\x75\x72\x63\x65\x2f"+this.pe_IC.toLowerCase()+"\x2f"+this.pe_aYY+"\x2e"+this.pe_IC.toLowerCase();}},pe_NM:function(pe_Tf,pe_ZJ){if(pe_Tf.length>0&&pe_ZJ.length>0){var pe_vF=pe_Tf.split("\x2d");var pe_wT=pe_ZJ.split("\x2d");if(pe_vF.length==3&&pe_wT.length==3){if(parseInt(pe_vF[0])>=parseInt(pe_wT[0])){if(parseInt(pe_vF[0])>=parseInt(pe_wT[0])){if(parseInt(pe_vF[0])>=parseInt(pe_wT[0])){return false;}}}}}return true;},pe_adQ:function(pe_nx){var string="";var i=0;var c=c1=c2=0;while(i<pe_nx.length){c=pe_nx.charCodeAt(i);if(c<128){string+=String.fromCharCode(c);i++;}else if((c>191)&&(c<224)){c2=pe_nx.charCodeAt(i+1);string+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=2;}else{c2=pe_nx.charCodeAt(i+1);c3=pe_nx.charCodeAt(i+2);string+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=3;}}return string;},pe_uL:function(source){var input=source;var pe_mZ="\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(i<input.length){enc1=pe_mZ.indexOf(input.charAt(i++));enc2=pe_mZ.indexOf(input.charAt(i++));enc3=pe_mZ.indexOf(input.charAt(i++));enc4=pe_mZ.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2);}if(enc4!=64){output=output+String.fromCharCode(chr3);}}output=this.pe_adQ(output);return output;},pe_nu:function(str){str=str.replace(/:/g,"\x3d");str=str.replace(/;/g,"\x3d\x3d");str=this.pe_uL(str);str=this.pe_jA(str,"\x63","\x38");str=this.pe_jA(str,"\x72","\x51");str=this.pe_jA(str,"\x50","\x76");str=this.pe_jA(str,"\x6d","\x55");str=this.pe_jA(str,"\x37","\x35");str=this.pe_jA(str,"\x62","\x32");str=this.pe_jA(str,"\x73","\x56");str=this.pe_jA(str,"\x54","\x78");str=this.pe_jA(str,"\x7a","\x5a");str=this.pe_jA(str,"\x66","\x69");str=this.pe_jA(str,"\x65","\x44");str=this.pe_jA(str,"\x47","\x61");str=this.pe_afk(str);str=this.pe_uL(str);return str;},pe_afk:function(str){if(str.length%4!=0)throw "\x6f\x6e\x65\x72\x72\x6f\x72";var len=Math.ceil(str.length/2);var strL=str.substring(0,len);var strR=str.substring(len);var pe_Ir=Math.ceil(strL.length/2);var pe_Ze=strL.substring(0,pe_Ir);var pe_Zf=strL.substring(pe_Ir);var pe_Ie=Math.ceil(strR.length/2);var pe_Yj=strR.substring(0,pe_Ie);var pe_Zm=strR.substring(pe_Ie);return pe_Ze+pe_Yj+pe_Zf+pe_Zm;},pe_jA:function(str,pe_Dj,pe_Eq){var temp="\x2c";str=str.replace(new RegExp(pe_Dj,"\x67"),temp);str=str.replace(new RegExp(pe_Eq,"\x67"),pe_Dj);str=str.replace(new RegExp(temp,"\x67"),pe_Eq);return str;},pe_atQ:function(pe_FV,pe_xv,dataObj){$.ajax({type:'\x70\x6f\x73\x74',dataType:'\x6a\x73\x6f\x6e',url:this.URL,data:dataObj,success:function(data){if(pe_FV){pe_FV.call(this,data);}},error:function(request,status,error){if(pe_xv){pe_xv.call(error);}}});},pe_ata:function(pe_FV,pe_xv){$.ajax({type:'\x70\x6f\x73\x74',dataType:'\x74\x65\x78\x74',url:this.pe_atz,data:{source:this.source,target:this.target,input:encodeURI(this.content)},success:function(data){if(typeof data==='\x73\x74\x72\x69\x6e\x67'){try{data=JSON.parse(data);}catch(exp){}}var err="";if(data&&data.outputs&&data.outputs.length>0){data=data.outputs[0];if(data&&data.output)data=data.output;if(data&&data.error)err=data.error;}if(err.length<=0){if(pe_FV){pe_FV.call(this,data);}}else{if(pe_xv){pe_xv.call(this,err);}}},error:function(request,status,error){if(pe_xv){pe_xv.call(error);}}});}};(function($){'\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74';$.trans=function(o){if(typeof o==="\x6f\x62\x6a\x65\x63\x74"){pe_qc.pe_Ay(o);pe_qc.pe_atQ(function(data){if(pe_qc.pe_NM(pe_qc.pe_nu(data.trans),data.cur_date)){if(o.error){o.error.call(this,"\x54\x68\x65\x20\x70\x65\x72\x69\x6f\x64\x20\x68\x61\x73\x20\x65\x78\x70\x69\x72\x65\x64");}return;}pe_qc.pe_ata(function(data){if(o.success){o.success.call(this,data);}},function(error){if(o.error){o.error.call(this,error);}});},function(error){if(o.error){o.error.call(this,error);}});}},$.fn.trans=function(o){var txt=$(this).text();if(typeof o==="\x6f\x62\x6a\x65\x63\x74"){o.content=txt;pe_qc.pe_Ay(o);pe_qc.pe_atQ(function(data){if(pe_qc.pe_NM(pe_qc.pe_nu(data.trans),data.cur_date)){if(o.error){o.error.call(this,"\x54\x68\x65\x20\x70\x65\x72\x69\x6f\x64\x20\x68\x61\x73\x20\x65\x78\x70\x69\x72\x65\x64");}return;}pe_qc.pe_ata(function(data){if(o.success){o.success.call(this,data);}},function(error){if(o.error){o.error.call(this,error);}});},function(error){if(o.error){o.error.call(this,error);}});}}})(jQuery);