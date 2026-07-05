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
badd +48 apps/api/src/index.ts
badd +1 packages/utils/env.ts
badd +17 .env
badd +1 package.json
badd +19 apps/api/package.json
badd +14 apps/web/package.json
badd +8 apps/api/tsconfig.json
badd +8 packages/utils/package.json
badd +1 packages/utils/src/env.ts
badd +5 tsconfig.json
badd +9 packages/utils/tsconfig.json
badd +276 .agents/repo.md
badd +9 packages/db/tsconfig.json
badd +7 packages/db/package.json
badd +1 packages/db/src/index.ts
badd +1 packages/utils/src/index.ts
badd +13 packages/tsconfig/base.json
badd +1 packages/tsconfig/node.json
badd +6 packages/tsconfig/web.json
badd +116 ~/Developer/Work/personalWork/websites/stupid/node_modules/.pnpm/fastify@5.9.0/node_modules/fastify/fastify.d.ts
badd +1 node_modules/.pnpm/fastify@5.9.0/node_modules/fastify/package.json
badd +1 ~/Developer/Work/personalWork/websites/stupid/.pnpm-store/v11/.tmp/pnpm-11.10.0-1783250452321/package.json
badd +1 .pnpm-store/v11/.pnpm-needs-build-marker
badd +1 .pnpm-store/v11/index.db
badd +1 .pnpm-store/v11/index.db-shm
badd +1 .pnpm-store/v11/index.db-wal
badd +1 ~/Developer/Work/personalWork/websites/stupid/apps/web/tsconfig.tsbuildinfo
badd +13 apps/web/tsconfig.node.json
badd +1 apps/web/.gitignore
badd +5 apps/web/tsconfig.app.json
badd +7 apps/web/tsconfig.json
badd +3 pnpm-workspace.yaml
badd +23 ~/Developer/Work/personalWork/websites/stupid/apps/api/src/config/env.ts
badd +139 ~/Developer/Work/personalWork/websites/stupid/node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/main.d.ts
badd +27 ~/Developer/Work/personalWork/websites/stupid/node_modules/.pnpm/fastify@5.9.0/node_modules/fastify/types/logger.d.ts
badd +2 apps/api/src/routes/auth.route.ts
badd +6 apps/api/src/routes/health.route.ts
badd +3 ~/Developer/Work/personalWork/websites/stupid/packages/validation/request/auth.ts
argglobal
%argdel
edit ~/Developer/Work/personalWork/websites/stupid/apps/api/src/config/env.ts
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
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
exe '1resize ' . ((&lines * 30 + 31) / 62)
exe 'vert 1resize ' . ((&columns * 94 + 94) / 189)
exe '2resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 2resize ' . ((&columns * 94 + 94) / 189)
exe '3resize ' . ((&lines * 30 + 31) / 62)
exe 'vert 3resize ' . ((&columns * 94 + 94) / 189)
exe '4resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 4resize ' . ((&columns * 94 + 94) / 189)
argglobal
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
let s:l = 24 - ((23 * winheight(0) + 15) / 30)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 24
normal! 0
wincmd w
argglobal
if bufexists(fnamemodify("apps/api/tsconfig.json", ":p")) | buffer apps/api/tsconfig.json | else | edit apps/api/tsconfig.json | endif
if &buftype ==# 'terminal'
  silent file apps/api/tsconfig.json
endif
balt packages/tsconfig/base.json
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
let s:l = 8 - ((7 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 8
normal! 025|
wincmd w
argglobal
if bufexists(fnamemodify("apps/api/src/routes/auth.route.ts", ":p")) | buffer apps/api/src/routes/auth.route.ts | else | edit apps/api/src/routes/auth.route.ts | endif
if &buftype ==# 'terminal'
  silent file apps/api/src/routes/auth.route.ts
endif
balt apps/api/src/index.ts
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
let s:l = 2 - ((1 * winheight(0) + 15) / 30)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 2
normal! 049|
wincmd w
argglobal
if bufexists(fnamemodify("~/Developer/Work/personalWork/websites/stupid/packages/validation/request/auth.ts", ":p")) | buffer ~/Developer/Work/personalWork/websites/stupid/packages/validation/request/auth.ts | else | edit ~/Developer/Work/personalWork/websites/stupid/packages/validation/request/auth.ts | endif
if &buftype ==# 'terminal'
  silent file ~/Developer/Work/personalWork/websites/stupid/packages/validation/request/auth.ts
endif
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
let s:l = 1 - ((0 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 020|
wincmd w
3wincmd w
exe '1resize ' . ((&lines * 30 + 31) / 62)
exe 'vert 1resize ' . ((&columns * 94 + 94) / 189)
exe '2resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 2resize ' . ((&columns * 94 + 94) / 189)
exe '3resize ' . ((&lines * 30 + 31) / 62)
exe 'vert 3resize ' . ((&columns * 94 + 94) / 189)
exe '4resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 4resize ' . ((&columns * 94 + 94) / 189)
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
