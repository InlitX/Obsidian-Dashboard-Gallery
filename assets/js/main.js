const blogPosts = {
    post1: {
        date: '2026-03-15',
        readTime: 3,
        image: 'images/dashboards/komoribe/komoribe.png',
        titles: {
            en: 'New dashboards coming soon',
            es: 'Nuevos dashboards en camino',
            fr: 'Nouveaux tableaux de bord a venir',
            de: 'Neue Dashboards kommen bald',
            it: 'Nuove dashboard in arrivo',
            pt: 'Novos dashboards a caminho',
            zh: 'Xin yibiao pan ji jiang tuichu',
            ja: 'Atarashii dashborado kiru chu'
        },
        excerpts: {
            en: "We're working on incredible new designs for your vault.",
            es: 'Estamos trabajando en nuevos disenos increibles para tu boveda.',
            fr: 'Nous travaillons sur de nouveaux designs incroyable pour votre coffre.',
            de: 'Wir arbeiten an unglaublichen neuen Designs fur deinen Tresor.',
            it: 'Stiamo lavorando su nuovi design incredibili per il tuo vault.',
            pt: 'Estamos trabalhando em novos designs incriveis para seu cofre.',
            zh: 'Women zhengzai kaifa xin sheji.',
            ja: 'Atarashii dezain wo sakusei chu'
        },
        content: {
            en: `
                <p>We are excited to announce that we are working on several new dashboard designs for Obsidian. Our team is crafting unique layouts that combine aesthetics with functionality.</p>
                <h2>What's Coming</h2>
                <p>Each new dashboard will maintain the plug-and-play philosophy that our community loves. Here are some highlights:</p>
                <ul>
                    <li><strong>Minimalist Pro</strong> - A cleaner, more focused design</li>
                    <li><strong>Productivity Hub</strong> - All your tasks and calendar in one view</li>
                    <li><strong>Creative Studio</strong> - For writers and creative professionals</li>
                </ul>
                <p>Stay tuned for sneak peeks and release dates!</p>
            `,
            es: `
                <p>Estamos emocionados de anunciar que estamos trabajando en varios disenos nuevos de dashboards para Obsidian. Nuestro equipo esta creando disenos unicos que combinan estetica con funcionalidad.</p>
                <h2>Que viene</h2>
                <p>Cada nuevo dashboard mantendra la filosofia plug-and-play que a nuestra comunidad le encanta. Aqui tienes algunos detalles:</p>
                <ul>
                    <li><strong>Minimalist Pro</strong> - Un diseno mas limpio y enfocado</li>
                    <li><strong>Productivity Hub</strong> - Todas tus tareas y calendario en una vista</li>
                    <li><strong>Creative Studio</strong> - Para escritores y profesionales creativos</li>
                </ul>
                <p>Mantente atento a las vistas previas y fechas de lanzamiento!</p>
            `,
            fr: `
                <p>Nous sommes ravis d'annoncer que nous travaillons sur plusieurs nouveaux designs de tableaux de bord pour Obsidian.</p>
                <h2>Ce qui arrive</h2>
                <p>Chaque nouveau tableau de bord maintiendra la philosophie plug-and-play. Voici quelques highlights:</p>
                <ul>
                    <li><strong>Minimalist Pro</strong> - Un design plus propre et plus concentre</li>
                    <li><strong>Productivity Hub</strong> - Toutes vos taches et calendrier en un seul vue</li>
                    <li><strong>Creative Studio</strong> - Pour les ecrivains et professionnels creatifs</li>
                </ul>
                <p>Restez a l'ecoute!</p>
            `,
            de: `
                <p>Wir freuen uns anzukundigen, dass wir an mehreren neuen Dashboard-Designs fur Obsidian arbeiten.</p>
                <h2>Was kommt</h2>
                <p>Jedes neue Dashboard wird die Plug-and-Play-Philosophie beibehalten. Hier sind einige Highlights:</p>
                <ul>
                    <li><strong>Minimalist Pro</strong> - Ein saubereres, fokussierteres Design</li>
                    <li><strong>Productivity Hub</strong> - Alle Ihre Aufgaben und Kalender in einer Ansicht</li>
                    <li><strong>Creative Studio</strong> - Fur Schriftsteller und kreative Profis</li>
                </ul>
                <p>Bleiben Sie dran!</p>
            `,
            it: `
                <p>Siamo entusiasti di annunciare che stiamo lavorando a diversi nuovi design di dashboard per Obsidian.</p>
                <h2>Cosa bolle in pentola</h2>
                <p>Ogni nuova dashboard manterra la filosofia plug-and-play. Ecco alcuni highlights:</p>
                <ul>
                    <li><strong>Minimalist Pro</strong> - Un design piu pulito e focalizzato</li>
                    <li><strong>Productivity Hub</strong> - Tutti i tuoi compiti e calendario in una vista</li>
                    <li><strong>Creative Studio</strong> - Per scrittori e professionisti creativi</li>
                </ul>
                <p>Restate sintonizzati!</p>
            `,
            pt: `
                <p>Estamos animados em anunciar que estamos trabalhando em varios novos designs de dashboards para Obsidian.</p>
                <h2>O que vem</h2>
                <p>Cada novo dashboard mantera a filosofia plug-and-play. Aqui estao alguns destaques:</p>
                <ul>
                    <li><strong>Minimalist Pro</strong> - Um design mais limpo e focado</li>
                    <li><strong>Productivity Hub</strong> - Todas as suas tarefas e calendario em uma visualizacao</li>
                    <li><strong>Creative Studio</strong> - Para escritores e profissionais criativos</li>
                </ul>
                <p>Fique de olho!</p>
            `,
            zh: `
                <p>Women hen xingfen di fu bu: women zhengzai wei Obsidian kaifa ji ge xin de yibiao pan sheji.</p>
                <h2>Ji jiang tui chu</h2>
                <p>Mei ge xin yibiao pan dou jiang bao chi women shequ suo ai de chaji jiyong zhe luo.</p>
                <ul>
                    <li><strong>Ji jian zhuan ye ban</strong> - Geng qingjie, geng zhuannu</li>
                    <li><strong>Xiaolv zhongxin</strong> - Suo you renwu he rili zai yige shitu zhong</li>
                    <li><strong>Chuangyi gongzuoshi</strong> - Wei zuojia he chuangyi zhuanye renshi sheji</li>
                </ul>
                <p>Qing chixu guanzhu!</p>
            `,
            ja: `
                <p>Obsidian you ni suitatsu no dashborado dezain wo kaihatsu chu de irasshaimasu.</p>
                <h2>Kiru chu ni natte iru</h2>
                <p>Atarashii dashborado wa komuniti ga sukinanda plug and purei no tetsugan wo juyochu.</p>
                <ul>
                    <li><strong>Minamarisuto Pro</strong> - Motto mo kikun to shite fukusuu na dezain</li>
                    <li><strong>Purodakuchibiti Hubu</strong> - Subete no tsuku to karenda wo ichi ni miru</li>
                    <li><strong>Kuriachibusutajio</strong> - Sakuseisha to kuriachibu puro no tame ni</li>
                </ul>
                <p>Ki wo tsukete!</p>
            `
        }
    },
    post2: {
        date: '2026-02-28',
        readTime: 5,
        image: 'images/dashboards/Dashboard-Brutalist/Dashboard-Brutalist.png',
        titles: {
            en: 'How to install a dashboard',
            es: 'Como instalar un dashboard',
            fr: 'Comment installer un tableau de bord',
            de: 'So installierst du ein Dashboard',
            it: 'Come installare una dashboard',
            pt: 'Como instalar um dashboard',
            zh: 'Ruhe anzhuang yibiao pan',
            ja: 'Dashborado no insutoru houhou'
        },
        excerpts: {
            en: 'Step by step guide to copy and use any dashboard.',
            es: 'Guia paso a paso para copiar y usar cualquier dashboard.',
            fr: 'Guide etape par etape pour copier et utiliser un tableau de bord.',
            de: 'Schritt-fur-Schritt-Anleitung zum Kopieren und Verwenden eines Dashboards.',
            it: 'Guida passo passo per copiare e usare una dashboard.',
            pt: 'Guia passo a passo para copiar e usar um dashboard.',
            zh: 'Fen bu zhinan jiaoni fuzhi he shiyong renhe yibiao pan.',
            ja: 'Nani demo dashborado wo fushi shiyousuru setto bai setto gaido.'
        },
        content: {
            en: `
                <p>Installing a dashboard in Obsidian is simple. Follow these steps:</p>
                <h2>Step 1: Download</h2>
                <p>Download the dashboard files from our GitHub repository. You can find all available dashboards in the releases section.</p>
                <h2>Step 2: Copy to Vault</h2>
                <p>Copy the dashboard folder to your Obsidian vault. Make sure to keep the folder structure intact.</p>
                <h2>Step 3: Open in Obsidian</h2>
                <p>Open Obsidian and navigate to the dashboard file. You can add it to your vault's daily notes or access it directly.</p>
                <h2>Step 4: Enjoy!</h2>
                <p>That's it! Your dashboard is ready to use. No complex configuration needed.</p>
                <blockquote>Tip: You can customize the dashboard by editing the CSS snippets or modifying the Dataview queries.</blockquote>
            `,
            es: `
                <p>Instalar un dashboard en Obsidian es simple. Sigue estos pasos:</p>
                <h2>Paso 1: Descargar</h2>
                <p>Descarga los archivos del dashboard desde nuestro repositorio de GitHub.</p>
                <h2>Paso 2: Copiar a la boveda</h2>
                <p>Copia la carpeta del dashboard a tu boveda de Obsidian.</p>
                <h2>Paso 3: Abrir en Obsidian</h2>
                <p>Abre Obsidian y navega al archivo del dashboard.</p>
                <h2>Paso 4: Disfrutar!</h2>
                <p>Asi de simple! Tu dashboard esta listo para usar.</p>
                <blockquote>Consejo: Puedes personalizar el dashboard editando los fragmentos CSS.</blockquote>
            `,
            fr: `
                <p>Installer un tableau de bord dans Obsidian est simple.</p>
                <h2>Etape 1: Telecharger</h2>
                <p>Telechargez les fichiers du tableau de bord depuis notre depot GitHub.</p>
                <h2>Etape 2: Copier dans le coffre</h2>
                <p>Copiez le dossier du tableau de bord dans votre coffre Obsidian.</p>
                <h2>Etape 3: Ouvrir dans Obsidian</h2>
                <p>Ouvrez Obsidian et accedez au fichier du tableau de bord.</p>
                <h2>Etape 4: Profiter!</h2>
                <p>C'est tout! Votre tableau de bord est pret.</p>
                <blockquote>Conseil: Vous pouvez personnaliser le tableau de bord en modifiant les extraits CSS.</blockquote>
            `,
            de: `
                <p>Ein Dashboard in Obsidian zu installieren ist einfach.</p>
                <h2>Schritt 1: Herunterladen</h2>
                <p>Laden Sie die Dashboard-Dateien von unserem GitHub-Repository herunter.</p>
                <h2>Schritt 2: In den Tresor kopieren</h2>
                <p>Kopieren Sie den Dashboard-Ordner in Ihren Obsidian-Tresor.</p>
                <h2>Schritt 3: In Obsidian oeffnen</h2>
                <p>Oeffnen Sie Obsidian und navigieren Sie zur Dashboard-Datei.</p>
                <h2>Schritt 4: Geniessen!</h2>
                <p>Das war's! Ihr Dashboard ist einsatzbereit.</p>
                <blockquote>Tipp: Sie koennen das Dashboard anpassen, indem Sie die CSS-Snippets bearbeiten.</blockquote>
            `,
            it: `
                <p>Installare una dashboard in Obsidian e semplice.</p>
                <h2>Passaggio 1: Scarica</h2>
                <p>Scarica i file della dashboard dal nostro repository GitHub.</p>
                <h2>Passaggio 2: Copia nel vault</h2>
                <p>Copia la cartella della dashboard nel tuo vault Obsidian.</p>
                <h2>Passaggio 3: Apri in Obsidian</h2>
                <p>Apri Obsidian e naviga al file della dashboard.</p>
                <h2>Passaggio 4: Goditi!</h2>
                <p>Questo e tutto! La tua dashboard e pronta all'uso.</p>
                <blockquote>Suggerimento: Puoi personalizzare la dashboard modificando gli snippet CSS.</blockquote>
            `,
            pt: `
                <p>Instalar um dashboard no Obsidian e simples.</p>
                <h2>Passo 1: Baixar</h2>
                <p>Baixe os arquivos do dashboard do nosso repositorio GitHub.</p>
                <h2>Passo 2: Copiar para o cofre</h2>
                <p>Copie a pasta do dashboard para seu cofre Obsidian.</p>
                <h2>Passo 3: Abrir no Obsidian</h2>
                <p>Abra o Obsidian e navegue ate o arquivo do dashboard.</p>
                <h2>Passo 4: Aproveite!</h2>
                <p>E isso! Seu dashboard esta pronto para usar.</p>
                <blockquote>Dica: Voce pode personalizar o dashboard editando os snippets CSS.</blockquote>
            `,
            zh: `
                <p>Zai Obsidian zhong anzhuang yibiao pan hen jiandan.</p>
                <h2>Buzhou 1: Xia zai</h2>
                <p>Cong women de GitHub kucun xiazai yibiao pan wenjian.</p>
                <h2>Buzhou 2: Fuzhi dao kucun</h2>
                <p>Jiang yibiao pan wenjianjia fuzhi dao nide Obsidian kucun.</p>
                <h2>Buzhou 3: Zai Obsidian zhong dakai</h2>
                <p>Da Kai Obsidian bing daohang dao yibiao pan wenjian.</p>
                <h2>Buzhou 4: Xiangshou!</h2>
                <p>Jiu shi zheyang! Nide yibiao pan yi zhengli hao shiyong.</p>
                <blockquote>Tishi: Ni keyi tongguo bianji CSS daima fengyue lai zidingyi yibiao pan.</blockquote>
            `,
            ja: `
                <p>Obsidian ni dashborado wo insutoru suru no wa kantan desu.</p>
                <h2>Suteppu 1: Daunrodo</h2>
                <p>Watashitachi no GitHub ribogitory kara dashborado fairu wo daunrodo shimasu.</p>
                <h2>Suteppu 2: Hokankeyou ni kopi</h2>
                <p>Dashborado fooru wo anata no Obsidian hokankeyou ni kopi shimasu.</p>
                <h2>Suteppu 3: Obsidian de hiraku</h2>
                <p>Obsidian wo akai, dashborado fairu ni ikobiga shimasu.</p>
                <h2>Suteppu 4: Otanjou!</h2>
                <p>Sore deosusu! Anata no dashborado ga shiyou kan ni narimashita.</p>
                <blockquote>Chippu: CSS snipetto wo henshuu shite dashborado wo koustomaizu dekimasu.</blockquote>
            `
        }
    },
    post3: {
        date: '2026-01-10',
        readTime: 4,
        image: 'images/dashboards/Dashboard-Zen/Dashboard-Zen.png',
        titles: {
            en: 'Community contributions',
            es: 'Contribuciones de la comunidad',
            fr: 'Contributions de la communaute',
            de: 'Community-Beitraege',
            it: 'Contributi della comunita',
            pt: 'Contribuicoes da comunidade',
            zh: 'Shequ gongxian',
            ja: 'Komuniti no koken'
        },
        excerpts: {
            en: 'How to contribute your own dashboards to the gallery.',
            es: 'Como contribuir con tus propios dashboards.',
            fr: 'Comment contribuer avec vos propres tableaux de bord.',
            de: 'Wie du eigene Dashboards beitragen kannst.',
            it: 'Come contribuire con le tue dashboard.',
            pt: 'Como contribuir com seus proprios dashboards.',
            zh: 'Ruhe wei tukugongxian niziji de yibiao pan.',
            ja: 'Jibun no dashborado wo garei ni koken suru houhou.'
        },
        content: {
            en: `
                <p>We welcome contributions from the community! If you have created a dashboard that you would like to share, here's how you can contribute.</p>
                <h2>Submission Guidelines</h2>
                <p>Before submitting, please ensure your dashboard meets these criteria:</p>
                <ul>
                    <li>Must be original work</li>
                    <li>Should be compatible with standard Obsidian installation</li>
                    <li>Include clear documentation</li>
                    <li>Have at least one screenshot</li>
                </ul>
                <h2>How to Submit</h2>
                <p>Submit a pull request on our GitHub repository with:</p>
                <ul>
                    <li>Clear screenshots of your dashboard</li>
                    <li>A brief description of features</li>
                    <li>Required plugins list</li>
                    <li>Installation instructions</li>
                </ul>
                <h2>Review Process</h2>
                <p>We review all submissions within 7 days. The best dashboards will be featured on our main page!</p>
            `,
            es: `
                <p>Damos la bienvenida a contribuciones de la comunidad! Si has creado un dashboard que te gustaria compartir, aqui te indicamos como puedes contribuir.</p>
                <h2>Directrices de envio</h2>
                <p>Antes de enviar, por favor asegurate de que tu dashboard cumple estos criterios:</p>
                <ul>
                    <li>Debe ser trabajo original</li>
                    <li>Debe ser compatible con la instalacion estandar de Obsidian</li>
                    <li>Incluir documentacion clara</li>
                    <li>Tener al menos una captura de pantalla</li>
                </ul>
                <h2>Como enviar</h2>
                <p>Envia un pull request en nuestro repositorio de GitHub.</p>
                <h2>Proceso de revision</h2>
                <p>Revisamos todos los envios en un plazo de 7 dias. Los mejores dashboards seran destacados en nuestra pagina principal!</p>
            `,
            fr: `
                <p>Nous accueillons les contributions de la communaute!</p>
                <h2>Directives de soumission</h2>
                <p>Avant de soumettre, veuillez vous assurer que votre tableau de bord repond a ces criteres:</p>
                <ul>
                    <li>Doit etre un travail original</li>
                    <li>Doit etre compatible avec l'installation standard d'Obsidian</li>
                    <li>Inclure une documentation claire</li>
                    <li>Avoir au moins une capture d'ecran</li>
                </ul>
                <h2>Comment soumettre</h2>
                <p>Soumettez une pull request sur notre depot GitHub.</p>
                <h2>Processus de revue</h2>
                <p>Nous examinons toutes les soumissions dans un delai de 7 jours.</p>
            `,
            de: `
                <p>Wir freuen uns ueber Beitraege aus der Community!</p>
                <h2>Einreichungsrichtlinien</h2>
                <p>Bevor du einreichst, stelle bitte sicher, dass dein Dashboard diese Kriterien erfuellt:</p>
                <ul>
                    <li>Muss Originalarbeit sein</li>
                    <li>Sollte mit der Standard-Obsidian-Installation kompatibel sein</li>
                    <li>Klare Dokumentation enthalten</li>
                    <li>Mindestens einen Screenshot haben</li>
                </ul>
                <h2>So reichst du ein</h2>
                <p>Reiche einen Pull-Request auf unserem GitHub-Repository ein.</p>
                <h2>Ueberpruefungsprozess</h2>
                <p>Wir ueberpruefen alle Einsendungen innerhalb von 7 Tagen.</p>
            `,
            it: `
                <p>Accogliamo contributi dalla communita!</p>
                <h2>Linee guida per l'invio</h2>
                <p>Prima di inviare, assicurati che la tua dashboard soddisfi questi criteri:</p>
                <ul>
                    <li>Deve essere lavoro originale</li>
                    <li>Dovrebbe essere compatibile con l'installazione standard di Obsidian</li>
                    <li>Includere documentazione chiara</li>
                    <li>Avere almeno uno screenshot</li>
                </ul>
                <h2>Come inviare</h2>
                <p>Invia una pull request sul nostro repository GitHub.</p>
                <h2>Processo di revisione</h2>
                <p>Esaminiamo tutti i contributi entro 7 giorni.</p>
            `,
            pt: `
                <p>Recebemos contribuicoes da comunidade!</p>
                <h2>Diretrizes de envio</h2>
                <p>Antes de enviar, certifique-se de que seu dashboard atende a estes criterios:</p>
                <ul>
                    <li>Deve ser trabalho original</li>
                    <li>Deve ser compativel com a instalacao padrao do Obsidian</li>
                    <li>Incluir documentacao clara</li>
                    <li>Ter pelo menos uma captura de tela</li>
                </ul>
                <h2>Como enviar</h2>
                <p>Envie um pull request em nosso repositorio GitHub.</p>
                <h2>Processo de revisao</h2>
                <p>Revisamos todos os envios em ate 7 dias.</p>
            `,
            zh: `
                <p>Women re lie huanying shequ gongxian!</p>
                <h2>Tijiao zhinan</h2>
                <p>Zai tijiao zhi qian, qing quebao nin de yibiao pan fuhe yixia biaozhun:</p>
                <ul>
                    <li>Bi xu shi yuanchuang zuopin</li>
                    <li>Ying yu biaozhun Obsidian anzhuang rongrong</li>
                    <li>Bao kuo qingchu de wendang</li>
                    <li>Zhi shao you yi zhang jietu</li>
                </ul>
                <h2>Ruhe tijiao</h2>
                <p>Zai women de GitHub kucun shang tijiao pull qingqiu.</p>
                <h2>Shenhe liucheng</h2>
                <p>Women hui zai 7 tian nei shencha suoyou tijiao.</p>
            `,
            ja: `
                <p>Komuniti kara no koken wo ukeirete imasu!</p>
                <h2>Tsuishutsu gainen</h2>
                <p>Teishutsu mae ni, anata no dashborado ga kono kijun wo mitasu ka dou kai:</p>
                <ul>
                    <li>Genpon no sakugyou de ari nasu</li>
                    <li>Hyoujun Obsidian insutoru to kiyakusei de ari nasu</li>
                    <li>Meikakuna dokyumento wo fukumu</li>
                    <li>Sukuran rettoga tashitomo atte iru</li>
                </ul>
                <h2>Tsuishutsu houhou</h2>
                <p>Watashitachi no GitHub ribogitory ni pucru rikuesuto wo teishutsu shimasu.</p>
                <h2>Rebyu purosesu</h2>
                <p>Watashitachi wa subete no teishutsu wo 7 nichi inai ni rebyu shimasu.</p>
            `
        }
    }
};

if (document.getElementById('blogGrid')) {
    function renderBlogPosts() {
        const grid = document.getElementById('blogGrid');
        grid.innerHTML = Object.entries(blogPosts).map(([id, post]) => `
            <a href="blog-post.html?p=${id}" class="blog-card">
                <div class="blog-date">${post.date}</div>
                <h3>${post.titles[currentLang] || post.titles.en}</h3>
                <p>${post.excerpts[currentLang] || post.excerpts.en}</p>
                <span class="blog-link">${t('blog.readMore')}</span>
            </a>
        `).join('');
    }
    renderBlogPosts();
}

const dashboardData = {
    brutalist: {
        titleKey: 'dashboards.brutalist',
        images: [
            'images/dashboards/Dashboard-Brutalist/Dashboard-Brutalist.png',
            'images/dashboards/Dashboard-Brutalist/Dashboard-Brutalist1.png'
        ],
        videos: [
            'images/dashboards/Dashboard-Brutalist/Dashboard-Brutalist.mp4'
        ],
        descKey: 'dashboards.brutalist.preview',
        specs: ['tasks', 'realTimeClock', 'weather', 'spotify', 'socialCards', 'navCards'],
        plugins: ['Dataview'],
        apiRequired: 'OpenWeatherMap',
        url: 'https://github.com/InlitX/Obsidian-Dashboard-Gallery'
    },
    komoribe: {
        titleKey: 'dashboards.komoribe',
        images: [
            'images/dashboards/komoribe/komoribe.png'
        ],
        videos: [
            'images/dashboards/komoribe/komoribe.mp4'
        ],
        descKey: 'dashboards.komoribe.preview',
        specs: ['customCards', 'miniCalendar', 'pomodoro', 'weeklyHabits', 'weather', 'musicPlayer', 'japaneseClock', 'quickActions'],
        plugins: ['Dataview', 'QuickAdd (opcional)'],
        apiRequired: 'OpenWeatherMap',
        url: 'https://github.com/InlitX/Obsidian-Dashboard-Gallery'
    },
    zen: {
        titleKey: 'dashboards.zen',
        images: [
            'images/dashboards/Dashboard-Zen/Dashboard-Zen.png',
            'images/dashboards/Dashboard-Zen/Dashboard-Zen2.png'
        ],
        videos: [
            'images/dashboards/Dashboard-Zen/Dashboard-Zen.mp4'
        ],
        descKey: 'dashboards.zen.preview',
        specs: ['dayGoal', 'taskPipeline', 'habits', 'bioPerf', 'taskPerf', 'serendipity', 'quickActions', 'banner'],
        plugins: ['Dataview'],
        url: 'https://github.com/InlitX/Obsidian-Dashboard-Gallery'
    }
};

let currentDashboardMedia = [];
let currentMediaIndex = 0;

const modal = document.getElementById('dashboardModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalMainImg = document.getElementById('modalMainImg');
const modalMainImgContainer = document.getElementById('modalMainImgContainer');
const modalThumbnails = document.getElementById('modalThumbnails');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxContent = document.getElementById('lightboxContent');

function getZoomableElement() {
    const src = currentDashboardMedia[currentMediaIndex];
    if (src && src.endsWith('.mp4')) {
        return lightboxContent.querySelector('video');
    }
    return lightboxImg;
}

function openDashboardModal(dashboardId) {
    const data = dashboardData[dashboardId];
    currentDashboardMedia = [...data.images, ...data.videos];
    currentMediaIndex = 0;

    updateModalMainContent();
    
    document.getElementById('modalTitle').textContent = t(data.titleKey);
    document.getElementById('modalDesc').textContent = t(data.descKey);
    document.getElementById('modalDownload').href = data.url;

    modalThumbnails.innerHTML = currentDashboardMedia.map((src, i) => {
        const isVideo = src.endsWith('.mp4');
        if (isVideo) {
            return `<video src="${src}" class="${i === 0 ? 'active' : ''}" data-index="${i}" muted></video>`;
        }
        return `<img src="${src}" alt="" class="${i === 0 ? 'active' : ''}" data-index="${i}">`;
    }).join('');

    modalThumbnails.querySelectorAll('img, video').forEach(thumb => {
        thumb.addEventListener('click', () => {
            currentMediaIndex = parseInt(thumb.dataset.index);
            updateModalMainContent();
            updateThumbnails();
        });
    });

    document.getElementById('modalSpecs').innerHTML = data.specs.map(spec => `
        <tr><td>${t('modal.specs.' + spec)}</td><td>&#10003;</td></tr>
    `).join('');

    document.getElementById('modalPlugins').innerHTML = data.plugins.map(p => `<span class="plugin-tag">${p}</span>`).join('');

    const apiContainer = document.getElementById('modalApiContainer');
    const apiEl = document.getElementById('modalApi');
    if (data.apiRequired) {
        apiContainer.style.display = 'block';
        const apiLinks = {
            'OpenWeatherMap': 'https://openweathermap.org/'
        };
        const link = apiLinks[data.apiRequired] || '#';
        apiEl.innerHTML = `<a href="${link}" target="_blank" class="plugin-tag plugin-link">${data.apiRequired}</a>`;
    } else {
        apiContainer.style.display = 'none';
    }

    modal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateModalMainContent() {
    const src = currentDashboardMedia[currentMediaIndex];
    const isVideo = src.endsWith('.mp4');
    
    if (isVideo) {
        modalMainImg.style.display = 'none';
        let video = modalMainImgContainer.querySelector('video');
        if (!video) {
            video = document.createElement('video');
            video.controls = true;
            video.loop = true;
            modalMainImgContainer.appendChild(video);
        }
        video.src = src;
        video.style.display = 'block';
    } else {
        modalMainImg.style.display = 'block';
        modalMainImg.src = src;
        const video = modalMainImgContainer.querySelector('video');
        if (video) video.remove();
    }
}

function closeDashboardModal() {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

modalMainImgContainer.addEventListener('click', () => {
    const currentSrc = currentDashboardMedia[currentMediaIndex];
    
    if (currentSrc) {
        if (currentSrc.endsWith('.mp4')) {
            const lightboxVideo = lightboxContent.querySelector('video') || document.createElement('video');
            lightboxVideo.src = currentSrc;
            lightboxVideo.controls = true;
            lightboxVideo.style.display = 'block';
            lightboxVideo.style.maxWidth = '90vw';
            lightboxVideo.style.maxHeight = '90vh';
            lightboxVideo.style.transform = 'scale(1) translate(0px, 0px)';
            lightboxImg.style.display = 'none';
            if (!lightboxVideo.parentNode) lightboxContent.appendChild(lightboxVideo);
        } else {
            lightboxImg.src = currentSrc;
            lightboxImg.style.display = 'block';
            lightboxImg.style.transform = 'scale(1) translate(0px, 0px)';
            const lightboxVideo = lightboxContent.querySelector('video');
            if (lightboxVideo) lightboxVideo.style.display = 'none';
        }
        lightbox.classList.add('active');
    }
});

function closeLightbox() {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    lightbox.classList.remove('active');
    const el = getZoomableElement();
    if (el) {
        el.classList.remove('zoomed');
        el.style.transform = 'scale(1) translate(0px, 0px)';
    }
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

lightboxPrev.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex - 1 + currentDashboardMedia.length) % currentDashboardMedia.length;
    const src = currentDashboardMedia[currentMediaIndex];
    updateLightboxMedia(src);
});

lightboxNext.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex + 1) % currentDashboardMedia.length;
    const src = currentDashboardMedia[currentMediaIndex];
    updateLightboxMedia(src);
});

function updateLightboxMedia(src) {
    if (src.endsWith('.mp4')) {
        let lightboxVideo = lightboxContent.querySelector('video');
        if (!lightboxVideo) {
            lightboxVideo = document.createElement('video');
            lightboxVideo.controls = true;
            lightboxContent.appendChild(lightboxVideo);
        }
        lightboxVideo.src = src;
        lightboxVideo.style.display = 'block';
        lightboxVideo.style.transform = 'scale(1) translate(0px, 0px)';
        lightboxImg.style.display = 'none';
    } else {
        lightboxImg.src = src;
        lightboxImg.style.display = 'block';
        lightboxImg.style.transform = 'scale(1) translate(0px, 0px)';
        const lightboxVideo = lightboxContent.querySelector('video');
        if (lightboxVideo) lightboxVideo.style.display = 'none';
    }
}

let currentScale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

lightboxContent.addEventListener('click', (e) => {
    const el = getZoomableElement();
    if (e.target === el) {
        currentScale = currentScale === 1 ? 2 : 1;
        if (currentScale === 1) {
            translateX = 0;
            translateY = 0;
            el.classList.remove('zoomed');
        } else {
            el.classList.add('zoomed');
        }
        el.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
});

lightboxContent.addEventListener('mousedown', (e) => {
    if (currentScale > 1 && e.target === getZoomableElement()) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const el = getZoomableElement();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        el.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

let initialDistance = 0;
let initialScale = 1;

lightboxContent.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = currentScale;
    } else if (e.touches.length === 1 && currentScale > 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
    }
});

lightboxContent.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        currentScale = Math.max(1, Math.min(initialScale * (currentDistance / initialDistance), 4));
        const el = getZoomableElement();
        el.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
        el.classList.toggle('zoomed', currentScale > 1);
    } else if (e.touches.length === 1 && isDragging) {
        const el = getZoomableElement();
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        el.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
    e.preventDefault();
});

lightboxContent.addEventListener('touchend', () => {
    isDragging = false;
    if (currentScale <= 1) {
        translateX = 0;
        translateY = 0;
    }
});

document.querySelectorAll('.dashboard-card').forEach(card => {
    card.addEventListener('click', () => openDashboardModal(card.dataset.dashboard));
});

modalClose.addEventListener('click', closeDashboardModal);
modalOverlay.addEventListener('click', closeDashboardModal);

modalPrev.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex - 1 + currentDashboardMedia.length) % currentDashboardMedia.length;
    updateModalMainContent();
    updateThumbnails();
});

modalNext.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex + 1) % currentDashboardMedia.length;
    updateModalMainContent();
    updateThumbnails();
});

function updateThumbnails() {
    modalThumbnails.querySelectorAll('img, video').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentMediaIndex);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDashboardModal();
        closeLightbox();
    }
    if (modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') modalPrev.click();
        if (e.key === 'ArrowRight') modalNext.click();
    }
    if (lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    }
});

if (window.location.pathname.includes('blog-post.html')) {
    function renderPost() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('p') || 'post1';
        const post = blogPosts[postId];

        if (!post) {
            document.getElementById('postContent').innerHTML = '<p>Post not found</p>';
            return;
        }

        const container = document.getElementById('postContent');
        container.innerHTML = `
            <header class="blog-post-header">
                <img src="${post.image}" alt="" class="blog-post-cover">
            </header>
            <div class="blog-post-body">
                <span class="blog-post-date">${post.date}</span>
                <h1>${post.titles[currentLang] || post.titles.en}</h1>
                <div class="blog-post-meta">
                    <span>${post.readTime} ${t('blog.readTime')}</span>
                </div>
                <div class="blog-post-content-text">
                    ${post.content[currentLang] || post.content.en}
                </div>
            </div>
        `;

        document.title = `${post.titles[currentLang] || post.titles.en} - Obsidian Dashboard Gallery`;
    }
    renderPost();
}
