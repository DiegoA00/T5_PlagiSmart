import { useParams } from 'react-router-dom';
import NavbarClient from "./Components/NavbarClient";
import Header from "./Components/Header";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ReservationDocuments() {
  const { codigo } = useParams();

  // Simulación de datos de documentos por reserva - esto vendría de una API
  const getDocumentsByReservation = (codigoReserva) => {
    const allDocuments = {
      "000001": [
        {
          type: "registro-fumigacion",
          title: "Registro de Fumigación",
          fileName: "Registro_Fumigacion",
          content: {
            mainTitle: "REGISTRO DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "request-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    dimension: "[Dimensiones de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    dimension: "[Dimensiones de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    dimension: "[Dimensiones de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    dimension: "[Dimensiones de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    dimension: "[Dimensiones de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]"
                  }
                ]
              },
              {
                type: "supplies-details",
                data: [
                  {
                    product: "Fosfina",
                    quantity: "50 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "5",
                  },
                  {
                    product: "Diatomita",
                    quantity: "20 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "3",
                  },
                  {
                    product: "Aerosol Insecticida",
                    quantity: "10 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "2",
                  },
                  {
                    product: "Trampa de Feromonas",
                    quantity: "5 unidades",
                    dose: "Instalación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "1",
                  },
                  {
                    product: "Equipo de Protección Personal (EPP)",
                    quantity: "5 juegos",
                    dose: "Uso obligatorio durante la fumigación",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "0",
                  }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        },
        {
          type: "registro-descarpe",
          title: "Registro de Descarpe",
          fileName: "Registro_Descarpe",
          content: {
            mainTitle: "REGISTRO DE DESCARPE",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "lot-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]",
                    ribbonsStatus: "[Estado de cintas de Lote 1]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 1]",
                    ppmFosfine: "[PPM Fosfina de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]",
                    ribbonsStatus: "[Estado de cintas de Lote 2]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 2]",
                    ppmFosfine: "[PPM Fosfina de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]",
                    ribbonsStatus: "[Estado de cintas de Lote 3]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 3]",
                    ppmFosfine: "[PPM Fosfina de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]",
                    ribbonsStatus: "[Estado de cintas de Lote 4]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 4]",
                    ppmFosfine: "[PPM Fosfina de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]",
                    ribbonsStatus: "[Estado de cintas de Lote 5]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 5]",
                    ppmFosfine: "[PPM Fosfina de Lote 5]"
                  }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        }
      ],
      "000002": [
        {
          type: "registro-fumigacion",
          title: "Registro de Fumigación",
          fileName: "Registro_Fumigacion",
          content: {
            mainTitle: "REGISTRO DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "request-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    dimension: "[Dimensiones de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    dimension: "[Dimensiones de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    dimension: "[Dimensiones de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    dimension: "[Dimensiones de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    dimension: "[Dimensiones de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]"
                  }
                ]
              },
              {
                type: "supplies-details",
                data: [
                  {
                    product: "Fosfina",
                    quantity: "50 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "5",
                  },
                  {
                    product: "Diatomita",
                    quantity: "20 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "3",
                  },
                  {
                    product: "Aerosol Insecticida",
                    quantity: "10 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "2",
                  },
                  {
                    product: "Trampa de Feromonas",
                    quantity: "5 unidades",
                    dose: "Instalación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "1",
                  },
                  {
                    product: "Equipo de Protección Personal (EPP)",
                    quantity: "5 juegos",
                    dose: "Uso obligatorio durante la fumigación",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "0",
                  }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        },
      ],
      "000003": [
        {
          type: "registro-fumigacion",
          title: "Registro de Fumigación",
          fileName: "Registro_Fumigacion",
          content: {
            mainTitle: "REGISTRO DE FUMIGACIÓN",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "request-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    dimension: "[Dimensiones de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    dimension: "[Dimensiones de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    dimension: "[Dimensiones de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    dimension: "[Dimensiones de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    dimension: "[Dimensiones de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]"
                  }
                ]
              },
              {
                type: "supplies-details",
                data: [
                  {
                    product: "Fosfina",
                    quantity: "50 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "5",
                  },
                  {
                    product: "Diatomita",
                    quantity: "20 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "3",
                  },
                  {
                    product: "Aerosol Insecticida",
                    quantity: "10 kg",
                    dose: "Aplicación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "2",
                  },
                  {
                    product: "Trampa de Feromonas",
                    quantity: "5 unidades",
                    dose: "Instalación según protocolo",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "1",
                  },
                  {
                    product: "Equipo de Protección Personal (EPP)",
                    quantity: "5 juegos",
                    dose: "Uso obligatorio durante la fumigación",
                    fumigationMethod: "Fumigación a presión",
                    ribbonsNumber: "0",
                  }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        },
        {
          type: "registro-descarpe",
          title: "Registro de Descarpe",
          fileName: "Registro_Descarpe",
          content: {
            mainTitle: "REGISTRO DE DESCARPE",
            subtitle: `Código de Reserva: ${codigoReserva}`,
            sections: [
              {
                type: "header",
                data: [
                  { label: "Empresa", value: "[Nombre de la Empresa]" },
                  { label: "Ubicación", value: "[Ubicación de la Fumigación]" },
                  { label: "Fecha", value: new Date().toLocaleDateString() },
                  { label: "Hora/Inicio", value: new Date().toLocaleTimeString() },
                  { label: "Hora/Fin", value: new Date().toLocaleTimeString() },
                  { label: "Supervisor", value: "[Nombre del Supervisor]" }
                ]
              },
              {
                type: "personal-info",
                data: [
                  {
                    name: "[Nombre de Personal 1]",
                    position: "[Cargo de Personal 1]"
                  },
                  {
                    name: "[Nombre de Personal 2]",
                    position: "[Cargo de Personal 2]"
                  },
                  {
                    name: "[Nombre de Personal 3]",
                    position: "[Cargo de Personal 3]"
                  },
                  {
                    name: "[Nombre de Personal 4]",
                    position: "[Cargo de Personal 4]"
                  },
                  {
                    name: "[Nombre de Personal 5]",
                    position: "[Cargo de Personal 5]"
                  }
                ]
              },
              {
                type: "lot-details",
                data: [
                  {
                    lot: "[Número de Lote 1]",
                    tons: "[Toneladas de Lote 1]",
                    quality: "[calidad de Lote 1]",
                    sacks: "[Número de sacos de Lote 1]",
                    destination: "[Destino de Lote 1]",
                    ribbonsStatus: "[Estado de cintas de Lote 1]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 1]",
                    ppmFosfine: "[PPM Fosfina de Lote 1]"
                  },
                  {
                    lot: "[Número de Lote 2]",
                    tons: "[Toneladas de Lote 2]",
                    quality: "[calidad de Lote 2]",
                    sacks: "[Número de sacos de Lote 2]",
                    destination: "[Destino de Lote 2]",
                    ribbonsStatus: "[Estado de cintas de Lote 2]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 2]",
                    ppmFosfine: "[PPM Fosfina de Lote 2]"
                  },
                  {
                    lot: "[Número de Lote 3]",
                    tons: "[Toneladas de Lote 3]",
                    quality: "[calidad de Lote 3]",
                    sacks: "[Número de sacos de Lote 3]",
                    destination: "[Destino de Lote 3]",
                    ribbonsStatus: "[Estado de cintas de Lote 3]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 3]",
                    ppmFosfine: "[PPM Fosfina de Lote 3]"
                  },
                  {
                    lot: "[Número de Lote 4]",
                    tons: "[Toneladas de Lote 4]",
                    quality: "[calidad de Lote 4]",
                    sacks: "[Número de sacos de Lote 4]",
                    destination: "[Destino de Lote 4]",
                    ribbonsStatus: "[Estado de cintas de Lote 4]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 4]",
                    ppmFosfine: "[PPM Fosfina de Lote 4]"
                  },
                  {
                    lot: "[Número de Lote 5]",
                    tons: "[Toneladas de Lote 5]",
                    quality: "[calidad de Lote 5]",
                    sacks: "[Número de sacos de Lote 5]",
                    destination: "[Destino de Lote 5]",
                    ribbonsStatus: "[Estado de cintas de Lote 5]",
                    fumigationTime: "[Tiempo de Fumigación de Lote 5]",
                    ppmFosfine: "[PPM Fosfina de Lote 5]"
                  }
                ]
              },
              {
                type: "signatures",
                signatures: ["Técnico Responsable Anecacao", "Cliente"]
              }
            ]
          }
        },
        {
          id: "certificado-fumigacion",
          title: "Certificado de Fumigación",
          fileName: "Certificado_Fumigacion",
          content: {
            mainTitle: "CERTIFICATE OF FUMIGATION",
            subtitle: `Certificado No. CERT-${codigoReserva}`,
            sections: [
              {
                type: "text",
                content1: "ANECACAO as an approved entity to provide cocoa-beans fumigation services with the certificate",
                content2: "No. 467-E.S.V., has provide the fumigation service under Agrocalidad's fumigation rulers and",
                content3: "regulations in its resolution 024-A."
              },
              {
                type: "grid",
                data: [
                  { label: "Export Company Address", value: "BABAHOYO EXPORT S.A." },
                  { label: "DATE OF THE FUMIGATION", value: new Date().toLocaleDateString() },
                  { label: "FUMIGATED PRODUCT", value: "Cocoa Beans" },
                  { label: "TYPE/CLASS OF BEANS", value: "Fine Flavour" },
                  { label: "LOT No.", value: "LOT-12345" },
                  { label: "NUMBER OF FUMIGATED BAGS", value: "100" },
                  { label: "COUNTRY/DESTINATION CITY", value: "PASIR GUDANG, MALAYSIA" },
                  { label: "CONSIGNEE", value: "Guang Chong Cocoa Manufacturer Sdn. Bhd. Plo 273, Jalan Timal 2, 81700 Pasir Gudang, Johor, Malaysia" },
                  { label: "COMPANY NAME", value: "ANECACAO" },
                  { label: "PERMIT/REGISTRATION", value: "467-E.S.V." },
                  { label: "NAME OF THE TECHNICAL FUMIGATOR", value: "Ing. Cristian Noboa" },
                  { label: "NAME OF THE PRODUCT USED", value: "GASTOXIN" },
                  { label: "FUMIGATION SYSTEM", value: "Piked/Pills" },
                  { label: "TIME FOR ACTION", value: "120 hours" },
                  { label: "APPLIED DOSE", value: "5 grams of Phosphine/Cubic Meter" },
                  { label: "ACTIVE COMPONENT", value: "Aluminum Phosphide - Phosphine" },
                  { label: "ROOM TEMPERATURE", value: "25°C" },
                  { label: "WASTES REMOVED BY", value: "Equaquímica" },
                  { label: "FUMIGATION END DATE", value: new Date().toLocaleDateString() }
                ]
              },
              {
                type: "single-signature",
                signature: "AUTHORIZED SIGNATURE",
              },
              {
                type: "footer"
              }
            ]
          }
        }
      ]
    };
    
    return allDocuments[codigoReserva] || [];
  };

  const documents = getDocumentsByReservation(codigo);

  // Función para renderizar diferentes tipos de secciones
  const renderSection = (section, index) => {
    switch (section.type) {
      case 'header':
        return (
          <div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {section.data[0].label && (
                <p>
                  <strong>{section.data[0].label}:</strong> {section.data[0].value}
                </p>
              )}
              {section.data[1].label && (
                <p>
                  <strong>{section.data[1].label}:</strong> {section.data[1].value}
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {section.data.slice(2).map((item, i) => (
                <p key={i}><strong>{item.label}:</strong> {item.value}</p>
              ))}
            </div>
          </div>
        );

      case 'personal-info':
        return (
          <table className="w-full mb-4 border">
            <thead>
              <tr>
                <th className="p-2" colSpan={3}>Personal que interviene</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="p-2">Nombre</th>
                <th className="p-2">Cargo</th>
                <th className="p-2">Firma</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(section.data).map(([key, value], i) => (
                <tr key={i} className="border-b">
                  <td className="p-2 text-center">{value.name}</td>
                  <td className="p-2 text-center">{value.position}</td>
                  <td className="p-2 text-center">{"Firma de " + value.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'request-details':
        return (
          <div>
            <table className="w-full mb-4 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className='p-2' colSpan={2}># de lote</th>
                  <th className='p-2' colSpan={2}>Dimensiones del lote</th>
                  <th className='p-2' colSpan={2}>Toneladas</th>
                  <th className='p-2' colSpan={2}>Calidad</th>
                  <th className='p-2' colSpan={2}># de sacos</th>
                  <th className='p-2' colSpan={2}>Destino</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(section.data).map(([key, value], i) =>
                  <tr key={i} className="border-b">
                    <td className="p-2 text-center" colSpan={2}>{value.lot}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.dimension}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.tons}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.quality}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.sacks}</td>
                    <td className="p-2 text-center" colSpan={2}>{value.destination}</td>
                  </tr>
                )}
                <tr>
                  <th className="p-2" colSpan={2}>Condiciones Ambientales</th>
                  <th className="p-2" colSpan={6}>Condiciones de seguridad industrial</th>
                  <th className="p-2" colSpan={4}>Observaciones:</th>
                </tr>
                <tr>
                  <th className="p-2">Temperatura:</th>
                  <td className="p-2">[Temperatura]</td>
                  <th className="p-2" colSpan={2}>Peligro eléctrico</th>
                  <th className='p-2' colSpan={2}>Peligro de caídas</th>
                  <th className="p-2" colSpan={2}>Peligro de atropellos</th>
                  <td className="p-2 text-center" colSpan={4}>[Sí/No]</td>
                </tr>
                <tr>
                  <th className="p-2">Humedad:</th>
                  <td className="p-2">[Humedad]</td>
                  <td className="p-2 text-center" colSpan={2}>[Sí/No]</td>
                  <td className="p-2 text-center" colSpan={2}>[Sí/No]</td>
                  <td className="p-2 text-center" colSpan={2}>[Sí/No]</td>
                </tr>
              </tbody>
            </table>
            <caption className="w-full flex justify-end mt-2 text-xs text-gray-600 mb-2">
              Nota: Si las condiciones no son adecuadas, no iniciar la actividad.
            </caption>
          </div>
        );
      
      case 'supplies-details':
        return (
          <div className="mt-6">
            <table className="w-full mb-4 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Producto</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Dosis</th>
                  <th className="p-2">Método de Fumigación</th>
                  <th className="p-2"># Cintas</th>
                </tr>
              </thead>
              <tbody>
                {section.data.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 text-center">{item.product}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center">{item.dose}</td>
                    <td className="p-2 text-center">{item.fumigationMethod}</td>
                    <td className="p-2 text-center">{item.ribbonsNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'lot-details':
        return (
          <div>
            <table className="w-full mb-4 border">
              <thead>
                <tr>
                  <th className="p-2" colSpan={8}>Descripción del lote</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className='p-2'># de lote</th>
                  <th className='p-2'>Toneladas</th>
                  <th className='p-2'>Calidad</th>
                  <th className='p-2'># de sacos</th>
                  <th className='p-2'>Destino</th>
                  <th className='p-2'>Estado de cintas</th>
                  <th className='p-2'>Tiempo de Fumigación</th>
                  <th className='p-2'>PPM Fosfina</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(section.data).map(([key, value], i) =>
                  <tr key={i} className="border-b">
                    <td className="p-2 text-center">{value.lot}</td>
                    <td className="p-2 text-center">{value.tons}</td>
                    <td className="p-2 text-center">{value.quality}</td>
                    <td className="p-2 text-center">{value.sacks}</td>
                    <td className="p-2 text-center">{value.destination}</td>
                    <td className="p-2 text-center">{value.ribbonsStatus}</td>
                    <td className="p-2 text-center">{value.fumigationTime}</td>
                    <td className="p-2 text-center">{value.ppmFosfine}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th className="p-2 text-center" colSpan={12}>Condiciones de seguridad industrial</th>
                </tr>
                <tr>
                  <th className="p-2" colSpan={2}>Peligro eléctrico</th>
                  <th className='p-2' colSpan={2}>Peligro de caídas</th>
                  <th className="p-2" colSpan={2}>Peligro de atropellos</th>
                  <th className="p-2" colSpan={2}>Otro peligro</th>
                </tr>
                <tr>
                  <td className="p-2 text-center" colSpan={2}>[Sí/No]</td>
                  <td className="p-2 text-center" colSpan={2}>[Sí/No]</td>
                  <td className="p-2 text-center" colSpan={2}>[Sí/No]</td>
                  <td className="p-2 text-center" colSpan={2}>[Sí/No]</td>
                </tr>
              </tfoot>
            </table>
            <caption className="w-full flex justify-end mt-2 text-xs text-gray-600 mb-2">
              Nota: Si las condiciones no son adecuadas, no iniciar la actividad.
            </caption>
          </div>
        );

      case 'grid':
        return (
          <div className='py-25 px-40'>
            {section.data.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <div className="p-2 text-left">
                  <p><strong>{item.label}:</strong></p>
                </div>
                <div className="p-2 text-right">
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <div key={index} className="mt-6">
            <p className="text-center">{section.content1}</p>
            <p className="text-center">{section.content2}</p>
            <p className="text-center">{section.content3}</p>
          </div>
        );
      
      case 'signatures':
        return (
          <div key={index} className="mt-6 grid grid-cols-2 gap-8 signature-section">
            {section.signatures.map((signature, i) => (
              <div key={i} className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-16 signature-line">
                  <p className="font-semibold">{signature}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'single-signature':
        return (
          <div key={index} className="mt-6 grid grid-cols-2 gap-8 text-center signature-section">
            <div className="text-center">
              <div className="pt-2 mt-16">
                <p className="font-semibold">DRY SEAL</p>
                <p className="text-xs">ANECACAO</p>
              </div>
            </div>
            <div className="border-t border-gray-400 pt-2 mt-16 signature-line inline-block">
              <p className="font-semibold">{section.signature}</p>
            </div>
          </div>
        );
      
      case 'footer':
        return (
          <div key={index} className="pt-5">
            <p className="text-center">E-mail: <a href={`mailto: administrativo@anecacao.com`}>administrativo@anecacao.com</a></p>
            <p className="text-center">ECUADOR EXPORTS QUALITY</p>
            <p className="text-center">WORLD'S FIRST GROWE OF FINE FLAVOUR COCOA</p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleConvertToPDF = async (documentType, elementId) => {
    let elementsToHide = [];
    
    try {
      // Obtener el elemento específico del documento
      const element = document.getElementById(elementId);
      if (!element) {
        console.error('Elemento no encontrado:', elementId);
        alert('No se pudo encontrar el documento. Por favor, recarga la página e intenta nuevamente.');
        return;
      }

      // Guardar referencia y ocultar temporalmente elementos que no queremos en el PDF
      elementsToHide = Array.from(document.querySelectorAll('.no-print'));
      const originalDisplays = elementsToHide.map(el => el.style.display);
      elementsToHide.forEach(el => el.style.display = 'none');

      // Esperar un momento para que se apliquen los cambios de CSS
      await new Promise(resolve => setTimeout(resolve, 100));

      // Crear canvas del elemento con configuración mejorada
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reducir escala para mejor rendimiento
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // Restaurar elementos ocultos inmediatamente
      elementsToHide.forEach((el, index) => {
        el.style.display = originalDisplays[index] || '';
      });

      // Crear PDF con dimensiones calculadas
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth - 20; // Márgenes de 10mm a cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Convertir canvas a imagen
      const imgData = canvas.toDataURL('image/png', 0.9);
      
      // Si la imagen es más alta que la página, ajustar
      if (imgHeight > pageHeight - 20) {
        const scaledHeight = pageHeight - 20;
        const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
        pdf.addImage(imgData, 'PNG', 10, 10, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      }
      
      // Crear nombre del archivo
      const fileName = `${documentType}_${codigo}.pdf`;
      
      // Crear blob y abrir en nueva pestaña
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      // Abrir en nueva pestaña
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert('Por favor, permite ventanas emergentes para ver el PDF.');
      }
      
      // También descargar el archivo
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error detallado al generar PDF:', error);
      
      // Asegurar que los elementos se restauren incluso si hay error
      elementsToHide.forEach(el => {
        el.style.display = '';
      });
      
      // Mensaje de error más específico
      let errorMessage = 'Error al generar el PDF. ';
      if (error.message.includes('canvas')) {
        errorMessage += 'Problema al capturar el contenido. ';
      } else if (error.message.includes('jsPDF')) {
        errorMessage += 'Problema al crear el PDF. ';
      }
      errorMessage += 'Por favor, intenta nuevamente o recarga la página.';
      
      alert(errorMessage);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex h-full">
        <NavbarClient />
        <main className="flex-1 bg-white overflow-y-scroll scrollbar-hide">
          <div className="px-6 py-4 pb-12">
            <div className="mb-6 no-print">
              <h1 className="text-2xl font-bold text-[#003595] mb-2">
                Documentos de Reserva - {codigo}
              </h1>
              <p className="text-gray-600">
                Gestiona y descarga los documentos relacionados con tu reserva
              </p>
              {documents.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">No hay documentos disponibles para esta reserva.</p>
                </div>
              )}
            </div>

            {/* Renderizado dinámico de documentos */}
            {documents.map((document, docIndex) => (
              <div 
                key={document.id}
                id={document.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 p-6 document-section"
                style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #e5e7eb' }}
              >
                <div className="flex justify-between items-center mb-4 no-print">
                  <h2 className="text-xl font-semibold text-[#003595]">
                    {document.title}
                  </h2>
                  <button
                    onClick={() => handleConvertToPDF(document.fileName, document.id)}
                    className="bg-[#003595] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Convertir a PDF
                  </button>
                </div>
                
                <div 
                  className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50 document-content"
                  style={{ backgroundColor: 'white', padding: '24px', border: '2px solid black' }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 document-title">
                      {document.content.mainTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {document.content.subtitle}
                    </p>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    {document.content.sections.map((section, sectionIndex) => 
                      renderSection(section, sectionIndex)
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Botón para regresar */}
            <div className="text-center mt-8 mb-8 no-print">
              <button
                onClick={() => window.history.back()}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Regresar a Reservas
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ReservationDocuments;
