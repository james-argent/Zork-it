var terminal = new Terminal('terminal', {}, {
    execute: function (cmd, args) {
        switch (cmd) {
            case 'clear':
                terminal.clear();
                return '';

            case 'help':
                return 'Check out the Readme.';

            case 'theme':
                if (args && args[0]) {
                    if (args.length > 1) return 'Too many arguments';
                    else if (args[0].match(/^interlaced|modern|white$/)) {
                        terminal.setTheme(args[0]);
                        return '';
                    }
                    else return 'Invalid theme';
                }
                return terminal.getTheme();

            default:
                // Unknown command.
                return false;
        }
        ;
    }
});