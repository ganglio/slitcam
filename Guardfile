# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'coffeescript', :input => 'src/coffee', :output => 'js'

guard 'compass' do
	watch('^(.*)\.s[ac]ss')
end

guard 'livereload' do
	watch(%r{.+\.css})
	watch(%r{.+\.js})
	watch(%r{.+\.html})
end