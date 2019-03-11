module.exports = 
{

    title: 'InSpec Profile Developers Course',
    description: "The MITRE InSpec Team's introduction to InSpec Profile Developmnet" ,

    themeConfig: 
    {
        sidebar: 'auto',
        navbar: 'auto',
        nav: [
                {
                    text: 'Course',
                    link: '/'
                },
                {
                    text: 'Install',
                    items: 
                    [
                        {
                        text: 'Linux',
                        link: '/installation/LinuxInstall.md'
                    },
                    {
                        text: 'Mac',
                        link: '/installation/MacInstall.md'
                    },
                    {
                        text: 'Windows',
                        link: '/installation/WindowsInstall.md'
                    }
                ],
            },
            {
                text: 'Resources',
                link: '/resources/',
            },
     ],
    },
    markdown: {
        lineNumbers: true,
        anchor: {
            permalink: true,
        },
        // options for markdown-it-toc
        toc: {
            includeLevel: [1, 2],
            listType: 'ul',            
        },
    }
}