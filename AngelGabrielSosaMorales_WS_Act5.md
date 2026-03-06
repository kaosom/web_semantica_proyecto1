<div align="center">
  <h3>Benemérita Universidad Autónoma de Puebla</h3>
  <h4>Facultad de Ciencias de la Computación</h4>
  <p><strong>Programa Educativo:</strong> Ciencias de la Computación</p>
  <br>
  <p><strong>Materia cursada:</strong> Web Semántica</p>
  <p><strong>Nombre del docente:</strong> Mireya Tovar</p>
  <br>
  <p><strong>Act. 5 - Reporte Proyecto XML (manual técnico y manual de usuario)</strong></p>
  <br>
  <p><strong>Nombre del alumno:</strong> Angel Gabriel Sosa Morales</p>
  <p><strong>Fecha:</strong> 11 de marzo de 2026</p>
</div>

<br><br><br>

## Índice

1. [Introducción](#introducción)
2. [Desarrollo](#desarrollo)
   - [Descripción del problema](#descripción-del-problema)
   - [Diseño, organización y estructura del sistema](#diseño-organización-y-estructura-del-sistema)
   - [Módulos principales o algoritmos](#módulos-principales-o-algoritmos)
   - [Requisitos de Hardware](#requisitos-de-hardware)
   - [Requisitos de Software](#requisitos-de-software)
   - [Instalación](#instalación)
   - [Manual de Usuario (Funcionalidades del Sistema)](#manual-de-usuario-funcionalidades-del-sistema)
3. [Conclusiones](#conclusiones)
4. [Referencias](#referencias)

---

## Introducción

En la era digital actual, la gestión estructurada de la información es un pilar fundamental para el desarrollo de aplicaciones web interactivas y eficientes. El estándar XML (eXtensible Markup Language) juega un papel crucial en la Web Semántica al permitir la representación, transporte y almacenamiento de datos de manera legible tanto para humanos como para máquinas.

El presente documento detalla el diseño, estructura y funcionamiento del "Sistema de Venta de Libros", una aplicación web desarrollada como proyecto integrador para la materia de Web Semántica. Este sistema demuestra la aplicación práctica de XML como persistencia de datos ligera para realizar operaciones completas de CRUD (Crear, Leer, Actualizar y Eliminar), así como para la generación de reportes operativos.

En las siguientes secciones se abordará de manera exhaustiva el manual técnico —que incluye los requisitos, la arquitectura del sistema y el proceso de instalación— así como un manual de usuario detallado que guiará al operador a través de las funciones de altas, bajas, cambios, consultas y reportes de la aplicación, dando completo cumplimiento a los lineamientos y rúbricas establecidas para la actividad.

---

## Desarrollo

### Descripción del problema
Las pequeñas librerías y puntos de venta independientes frecuentemente enfrentan el desafío de administrar su inventario y registro de ventas utilizando herramientas ineficientes, como hojas de cálculo manuales o sistemas costosos que exceden sus necesidades reales. El problema central consiste en construir una herramienta de software que permita gestionar el catálogo de libros y las transacciones diarias mediante una arquitectura sencilla pero robusta. Como solución, se desarrolló un sistema visual basado en tecnologías web modernas apoyado estrictamente en archivos XML virtuales (`libros.xml` y `ventas.xml`) para el almacenamiento estructurado y semántico de la información, prescindiendo de la complejidad de un motor de base de datos SQL tradicional y explorando los paradigmas de marcado de texto plano.

### Diseño, organización y estructura del sistema
El sistema se construyó bajo una **Arquitectura Cliente-Servidor** separando claramente la interfaz visual (Frontend) del motor analítico y almacenamiento (Backend), comunicados mediante una API RESTful.

En primer lugar, el Backend o Servidor API construido en Node.js, actúa como la capa lógica que procesa las solicitudes del cliente y administra el acceso a los datos almacenados en formato XML. Su capa de datos utiliza archivos `.xml` residentes en la carpeta `data/` como núcleo del almacenamiento. La librería `fast-xml-parser` se encarga de serializar y deserializar los nodos XML a objetos JSON manipulables por la lógica. Las rutas y controladores separan las lógicas de negocio en tres archivos principales: manejadores de libros, sistema de ventas y generación de reportes.

Por otro lado, el Frontend o Interfaz Visual, está desarrollado como una SPA (Single Page Application) utilizando React.js, Vite y Tailwind CSS para un entorno rico y visual. Emplea Context API para administrar el estado global de la aplicación. Además, la interfaz de usuario está dividida en componentes reutilizables como Modales para las altas y cambios, tablas de datos y buscadores, garantizando una gran claridad operativa.

### Módulos principales o algoritmos
La aplicación está segmentada funcionalmente para gestionar la información de módulos operativos específicos. Entre estos se encuentra el Módulo de Inventario, que maneja las altas, bajas y cambios de libros. El algoritmo de Altas recibe un payload desde el formulario visual, valida los campos como el ISBN único y campos obligatorios, genera el nuevo objeto, lo convierte a un nodo XML adherido al esquema de la librería y sobre-escribe exitosamente el árbol XML. Los procesos de Edición y Bajas ubican algorítmicamente el nodo interactuado mediante su atributo de Identificador Único mediante análisis (parsing). Una vez localizado, el nodo se extrae para las bajas o se mutan sus etiquetas internas para los cambios.

De igual forma, el Módulo Operativo de Venta y Consultas proporciona un entorno visual de punto de venta con un carrito interactivo. Aquí se consulta interactivamente el archivo XML, verificando e interceptando operaciones si la solicitud supera el atributo "Stock" del libro, registrando atómicamente la entrada en las ventas y actualizando en cascada la cantidad de libros disponibles. Finalmente, el Módulo de Reportes Simétricos se encarga de extraer grandes cantidades de nodos XML ejecutando ciclos que derivan en resúmenes como ingresos brutos, listados de piezas con umbrales bajos en almacén y la identificación del libro más vendido.

### Requisitos de Hardware
Para garantizar el correcto funcionamiento del sistema web y del servidor, se requieren especificaciones mínimas accesibles. Se aconseja un Procesador Intel Core i3, AMD Ryzen 3 o superior con arquitectura de 64 bits. Se solicita una memoria RAM de al menos 4 GB y un almacenamiento mínimo de 100 MB de espacio libre en el disco duro o unidad SSD para las dependencias del ecosistema. Como periféricos se requiere teclado, mouse y monitor con resolución mínima de pantalla de 1024x768 puntos.

### Requisitos de Software
El Sistema Operativo soportado abarca Windows 10 u 11, macOS 10.15 o superior, o distribuciones de Linux tipo Unix-like. Para el entorno de ejecución, es fundamental contar con Node.js en su versión 18 o alguna versión superior LTS instalada localmente, junto al gestor de paquetes NPM que viene incluido. Por último, para el navegador web, las interfaces visuales y módulos de la plataforma se soportan nativamente en Google Chrome, Mozilla Firefox, Brave o Microsoft Edge.

### Instalación
Para desplegar y compilar el sistema en cualquier máquina local, el usuario debe realizar algunos pasos esenciales dentro de la terminal de comandos de su sistema operativo.

El primer paso consiste en obtener el código, re-extrayendo el archivo empaquetado del proyecto a una carpeta de trabajo. Seguidamente, se debe acceder a la carpeta del Backend, ejecutar la instalación de dependencias y parseadores XML mediante la instrucción oportuna de NPM de instalación, y luego efectuar el montaje e inicio del servidor que atenderá peticiones por el puerto 3001.

El último paso implica configurar el diseño visual y Frontend entrando a la carpeta de su código, instalando las dependencias que habilitan sus estilos UI, y montando el servidor correspondiente mediante las herramientas de NPM en modo de desarrollo que publicará el proyecto en el puerto 5173. Cumpliendo estas pautas, el sistema quedará completamente funcional y accesible a través del navegador web local.

---

### Manual de Usuario (Funcionalidades del Sistema)
Al acceder en el navegador a la ruta principal, un Dashboard central dará la bienvenida con resúmenes rápidos del repositorio XML. A continuación se detalla el flujo de cada una de las funcionalidades transaccionales integradas en el portal:

**1. Consulta al Archivo (Lectura)**<br>
En el menú del costado izquierdo de la aplicación, existe un acceso al apartado de "Gestión de Libros". Al entrar a dicha sección se desplegará visualmente una tabla de datos procesada que enlista todos y cada uno de los nodos u obras literarias originadas en el archivo XML. Para ubicar rápidamente algún elemento, el usuario puede emplear de manera libre los filtros integrados o la barra de búsqueda de texto superior.

**2. Altas (Registro de nueva estructura XML)**<br>
Cuando el operador se encuentra sobre la pantalla de Gestión de Libros, podrá visualizar en la parte superior derecha el botón de "Nuevo Libro". Al hacer clic sobre el mismo, un modal emergerá requiriéndole al usuario diferentes rubros como el Título, Autor, Precio, Categoría y cantidad a proveer. Una vez rellenados los campos obligatorios, el usuario puede pulsar el botón "Guardar", acción con la cual el sistema interpretará y reescribirá el documento XML por detrás, marcando mediante un globo de alerta en color verde que la nueva alta literaria fue almacenada con indiscutible éxito.

**3. Cambios en Registros (Edición)**<br>
Para cualquier equivocación o actualización de variables, el sistema permite alterar directamente cualquier pieza existente. El usuario debe localizar la fila del libro que desea alterar dentro del entorno visual. Posteriormente, deberá presionar el pequeño botón gráfico correspondiente a "Editar", el cual se distingue comúnmente con un icono de lápiz situado del lado derecho de la información de dicha fila. Esto abre los datos actuales del modelo y el usuario podrá sustituirlas rellenando con los nuevos datos; enseguida, al pulsar guardar, el motor modificará de manera asíncrona este título respetando el resto del archivo global.

**4. Bajas en el Repositorio XML (Borrado)**<br>
Similar al proceso de cambios, si se requiere eliminar un libro obsoleto, el empleado identificará al infractor en el módulo de Gestión de libros. Una vez ahí, pulsará el pequeño icono de un cesto de basura, alusivo a la acción de Eliminar, de color rojizo. Para su protección ante posibles accidentes y salvaguardar la sanidad del repositorio principal de datos, el sistema pedirá automáticamente una confirmación de seguridad antes de proceder de manera destructiva en el XML. Al presionar "Aceptar" en esa ventana emergente, el nodo estructural y obra seleccionada desaparecerán del archivo fuente.

**5. Gestión de Módulos Transaccionales y Reportes**<br>
Las compras, envolturas e informes gerenciales gozan de otros flujos integrados en la aplicación superior. Dentro de las pestañas exclusivas para "Punto de Venta", los usuarios pueden añadir iterativamente tomos de su preferencia al panel auxiliar de un carrito comercial. Durante sus pulsaciones, el ecosistema web valida rigurosamente sus cantidades comprobando que existan en XML, restringiendo el intento simultáneamente en caso contrario y formalizando compras sin duplicidades.
Para reportes, el botón en el menú de "Reportes" dirigirá al observatorio visual. Mediante parámetros de calendario donde el interesado elige su margen de días, el apartado procesará sus utilidades visuales reportando transacciones en firme, conteos precisos e insumos menores a los permitidos a través de amigables diagramas numéricos.

---

## Conclusiones

La elaboración de este proyecto XML integral resultó invaluable para asimilar pragmáticamente los conceptos teóricos y características descriptivas evaluadas en Web Semántica, así como las métricas plasmadas en la rúbrica de aprendizaje. Se comprobó cómo un simple documento de texto basado en etiquetas puede convertirse en todo un paradigma de almacenamiento ligero sumamente potente asimilando su de-construcción de forma oportuna y orientada.

Desde mi perspectiva personal, el principal reto radicó en construir o integrar herramientas de software capaces de extraer y reescribir de manera concurrente los nodos XML de altas y bajas, sin romper la estructura general del archivo. La convergencia lograda en la robusta aplicación web moderna obtenida al final, prueba definitivamente el alcance y vida útil del XML como tecnología vigente. Logró superar las expectativas iniciales expuestas, ya que se cumplieron a cabalidad todas y cada una de las funcionalidades exigidas de la forma más pulcra, como lo son el registro con persistencia, administración exhaustiva e informes funcionales por periodos del negocio.

---

## Referencias

Amit Gupta & fast-xml-parser Contributors. (2025). *fast-xml-parser Documentation*. Repositorio Github. Recuperado de https://github.com/NaturalIntelligence/fast-xml-parser

Flomenbaum, J. (2025). *Guía sobre XML: eXtensible Markup Language para plataformas Web*. MDN Web Docs. Recuperado de https://developer.mozilla.org/es/docs/Web/XML/Introduccion

Node.js Foundation. (2025). *Node.js V.18 API Documentation (File System y Parsing)*. Node Docs. Recuperado de https://nodejs.org/docs/latest.html

Sperberg-McQueen, C. M., Maler, E., & Yergeau, F. (2008). *Extensible Markup Language (XML) W3C Recommendation*. W3C Documentation. Recuperado de https://www.w3.org/TR/REC-xml/
