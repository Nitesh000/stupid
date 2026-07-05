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
badd +28 apps/api/src/routes/auth.route.ts
badd +21 ~/Developer/Work/personalWork/websites/stupid/packages/validation/request/auth.ts
badd +12 packages/db/schema/index.ts
badd +40 apps/api/src/index.ts
badd +10 drizzle.config.ts
badd +63 .agents/repo.md
badd +49 apps/api/src/plugins/error.plugin.ts
badd +5 apps/api/src/config/err.ts
badd +31 ~/Developer/Work/personalWork/websites/stupid/node_modules/.pnpm/@fastify+error@4.2.0/node_modules/@fastify/error/types/index.d.ts
badd +23 .env
badd +7 ~/Developer/Work/personalWork/websites/stupid/node_modules/.pnpm/fastify-type-provider-zod@7.0.0_@fastify+swagger@9.7.0_fastify@5.9.0_openapi-types@12.1.3_zod@4.4.3/node_modules/fastify-type-provider-zod/dist/esm/core.d.ts
badd +3 tsconfig.json
badd +1 apps/api/tsconfig.json
badd +20 packages/tsconfig/base.json
badd +7 packages/tsconfig/node.json
argglobal
%argdel
edit apps/api/src/plugins/error.plugin.ts
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
exe 'vert 3resize ' . ((&columns * 94 + 94) / 189)
argglobal
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
let s:l = 49 - ((29 * winheight(0) + 15) / 30)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 49
normal! 02|
wincmd w
argglobal
if bufexists(fnamemodify("apps/api/src/index.ts", ":p")) | buffer apps/api/src/index.ts | else | edit apps/api/src/index.ts | endif
if &buftype ==# 'terminal'
  silent file apps/api/src/index.ts
endif
balt ~/Developer/Work/personalWork/websites/stupid/node_modules/.pnpm/fastify-type-provider-zod@7.0.0_@fastify+swagger@9.7.0_fastify@5.9.0_openapi-types@12.1.3_zod@4.4.3/node_modules/fastify-type-provider-zod/dist/esm/core.d.ts
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
let s:l = 42 - ((26 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 42
normal! 0
wincmd w
argglobal
if bufexists(fnamemodify("drizzle.config.ts", ":p")) | buffer drizzle.config.ts | else | edit drizzle.config.ts | endif
if &buftype ==# 'terminal'
  silent file drizzle.config.ts
endif
balt tsconfig.json
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
normal! 010|
wincmd w
3wincmd w
exe '1resize ' . ((&lines * 30 + 31) / 62)
exe 'vert 1resize ' . ((&columns * 94 + 94) / 189)
exe '2resize ' . ((&lines * 29 + 31) / 62)
exe 'vert 2resize ' . ((&columns * 94 + 94) / 189)
exe 'vert 3resize ' . ((&columns * 94 + 94) / 189)
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
