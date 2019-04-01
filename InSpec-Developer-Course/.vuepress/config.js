module.exports =
{

    title: 'InSpec Profile Developers Course',
    description: "The MITRE InSpec Team's introduction to InSpec Profile Development" ,

    themeConfig:
    {
        sidebar: 'auto',
        sidebarDepth: 4,
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
                        },
                        {
                            text: 'Vagrant Install',
                            link: '/installation/vagrant_install.md'
                        }
                    ],
                },
                {
                    text: 'Resources',
                    link: '/resources/',
                },
                {
                    text: 'Contact',
                    link: 'contact.md'
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
            includeLevel: [1, 2, 3, 4]
        },
    }
}
