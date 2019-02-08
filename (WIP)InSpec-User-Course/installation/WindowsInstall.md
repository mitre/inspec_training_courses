# Install InSpec on Windows

## Option 1 (package installer)
First things first: We need InSpec on our workstation. There are two packages that offer an easy way to get started. For production and standalone environments, I recommend the InSpec package. Alternatively there is ChefDK, if you need Chef + Test-Kitchen + InSpec. You can download both packages from [https://downloads.chef.io/](https://downloads.chef.io/).

## Option 2 (command line)
Another option is to install InSpec via a Powershell script:

```
$ . { iwr -useb https://omnitruck.chef.io/install.ps1 } | iex; install -project inspec
```

## After Install
Once InSpec is installed, run `inspec version` to verify that the installation was successful.

