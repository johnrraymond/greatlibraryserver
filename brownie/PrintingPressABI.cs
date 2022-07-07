namespace MoralisWeb3ApiSdk { public class PrintingPressABI { public static string ABI = "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_cCA\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_gasToken\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"who\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"what\",\"type\":\"address\"}],\"name\":\"BookContract\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"parent\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"child\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"parentId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"childId\",\"type\":\"uint256\"}],\"name\":\"PairPrinted\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_whom\",\"type\":\"address\"}],\"name\":\"addBalance\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_whom\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"}],\"name\":\"addBalanceCC\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"addonPay\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_NBT\",\"type\":\"address\"}],\"name\":\"buyBook\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_to\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_NBT\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_tokenMax\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_gasRewards\",\"type\":\"uint256\"}],\"name\":\"delegateMinter\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_whom\",\"type\":\"address\"}],\"name\":\"getBalance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_to\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_NBT\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_gasRewards\",\"type\":\"uint256\"}],\"name\":\"mintPair\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_symbol\",\"type\":\"string\"},{\"internalType\":\"address\",\"name\":\"_bookRegistryAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"_baseuri\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"_burnable\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"_maxmint\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_defaultprice\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_defaultfrom\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_mintTo\",\"type\":\"address\"}],\"name\":\"newBookContract\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_a\",\"type\":\"address\"}],\"name\":\"retireBookContract\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_operatorFee\",\"type\":\"uint256\"}],\"name\":\"setOperatorFee\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"; } }