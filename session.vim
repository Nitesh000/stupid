let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
doautoall SessionLoadPre
silent only
silent tabonly
cd ~/Developer/Work/personalWork/websites/stupid
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
set shortmess+=aoO
badd +16 ~/Developer/Work/personalWork/websites/stupid/apps/api/src/lib/auth.ts
badd +0 package.json
badd +7 apps/web/tsconfig.json
badd +1 packages/db/src/index.ts
badd +1 packages/db/config.ts
badd +4 packages/db/schema/index.ts
badd +1 packages/db/client/index.ts
badd +11 apps/web/src/index.tsx
badd +2 ~/Developer/Work/personalWork/websites/stupid/apps/web/src/App.tsx
badd +2 packages/tsconfig/web.json
badd +12 packages/tsconfig/base.json
badd +1 packages/tsconfig/node.json
badd +5 apps/web/src/lib/auth-client.ts
badd +24 apps/web/src/config/env.ts
badd +32 apps/api/src/config/env.ts
badd +46 .env
badd +22 ~/Developer/Work/personalWork/websites/stupid/node_modules/.pnpm/@solidjs+router@0.16.1_solid-js@1.9.14/node_modules/@solidjs/router/dist/routers/components.d.ts
badd +2 ~/Developer/Work/personalWork/websites/stupid/apps/web/src/pages/home/Home.tsx
argglobal
%argdel
edit ~/Developer/Work/personalWork/websites/stupid/apps/web/src/App.tsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 94 + 94) / 189)
exe 'vert 2resize ' . ((&columns * 94 + 94) / 189)
argglobal
balt ~/Developer/Work/personalWork/websites/stupid/apps/web/src/pages/home/Home.tsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 2 - ((1 * winheight(0) + 30) / 60)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 2
normal! 032|
wincmd w
argglobal
if bufexists(fnamemodify("apps/web/src/index.tsx", ":p")) | buffer apps/web/src/index.tsx | else | edit apps/web/src/index.tsx | endif
if &buftype ==# 'terminal'
  silent file apps/web/src/index.tsx
endif
balt ~/Developer/Work/personalWork/websites/stupid/apps/web/src/App.tsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 10 - ((9 * winheight(0) + 30) / 60)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 10
normal! 08|
wincmd w
exe 'vert 1resize ' . ((&columns * 94 + 94) / 189)
exe 'vert 2resize ' . ((&columns * 94 + 94) / 189)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
